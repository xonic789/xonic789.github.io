# blog-pageviews

블로그 글 조회수를 세고 돌려주는 Cloudflare Worker. 저장소는 D1(SQLite).

기존에는 GoatCounter의 공개 counter API를 브라우저가 직접 호출했는데,
호스팅 인스턴스가 내려가면 조회수가 통째로 안 나오는 문제가 있어 직접 운영하는 것으로 바꿨다.

## API

| 요청 | 동작 |
| --- | --- |
| `GET /views?path=/posts/foo` | 현재 조회수 조회 (증가 없음) |
| `POST /views` `{"path": "/posts/foo"}` | 조회수 +1 후 새 값 반환 |

응답: `{"path": "/posts/foo", "count": 42}`

읽기는 인증 없이 공개다. 정적 사이트라 브라우저가 직접 숫자를 물어봐야 하기 때문.
쓰기는 비밀키 대신 아래 세 가지로 제한한다.

- `ALLOWED_ORIGINS` — 브라우저에서 호출 가능한 origin allowlist (CORS)
- `PATH_PREFIX` — 이 접두어 아래 경로만 기록. 임의의 키로 테이블을 채우는 것을 막는다
- User-Agent 봇 필터 — 봇은 숫자를 받아가되 카운트는 올리지 않는다

같은 방문자의 중복 카운트는 블로그 쪽 `sessionStorage`로 세션당 1회로 억제한다.

## 배포

```bash
npx wrangler login

# D1 생성 후, 출력된 database_id 를 wrangler.toml 에 채운다
npx wrangler d1 create blog-pageviews

npm run migrate:remote
npm run deploy
```

배포 후 출력되는 Worker URL을 블로그 `_config.yml` 의 `pageviews.endpoint` 에 넣는다.

## 로컬 개발

```bash
npm run migrate:local
npm run dev
npm test
```

## 데이터 손질

```bash
# 상위 조회수
npx wrangler d1 execute blog-pageviews --remote \
  --command "SELECT path, count FROM pageviews ORDER BY count DESC LIMIT 20"

# 기존 조회수 이관 (GoatCounter 복구 후 export 했을 때)
npx wrangler d1 execute blog-pageviews --remote \
  --command "INSERT INTO pageviews (path, count) VALUES ('/posts/foo', 123)
             ON CONFLICT(path) DO UPDATE SET count = excluded.count"
```
