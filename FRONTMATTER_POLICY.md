# Front Matter 정책 (xonic789.github.io)

기존 `_posts` 스타일을 기준으로 정리한 운영 규칙입니다.

## 필수 필드

```yaml
---
title: 글 제목
date: YYYY-MM-DD HH:MM:SS +0900
description: 검색 결과와 공유 카드에 노출될 1~2문장 요약
published: true
---
```

- `title`: 게시글 제목
- `date`: KST 기준 발행 시각
- `description`: 검색엔진 메타 설명과 소셜 미리보기 설명에 사용될 요약
- `published`: 공개 여부 (`true` 권장)

## 권장 필드

```yaml
categories: [대분류, 소분류]   # 없으면 생략 가능
tags: [tag1, tag2, tag3]
image:
  path: /assets/img/posts/yyyy/example.png
  alt: 이미지 설명
pin: false
```

- `categories`: 0~2개 권장
- `tags`: 소문자/케밥케이스 우선 권장
- `image`: 대표 이미지가 있으면 Open Graph 미리보기 품질이 좋아짐
- `pin`: 기본 `false` — 자세한 운영 기준은 아래 **Pin 정책** 참고

## Pin (홈 고정) 정책

Chirpy에서 `pin: true`는 글을 **날짜와 무관하게 홈 최상단에 고정**한다. 여러 개를 고정하면 고정글끼리 **최신 날짜순**으로 정렬된다. 즉 pin은 *처음 온 방문자(채용 담당·동료 등)에게 먼저 보여줄 대표글 진열대*이지 즐겨찾기 목록이 아니다.

**원칙**

1. **희소성 — 동시에 3~5개까지.** 절반 이상을 고정하면 강조의 의미가 사라진다("다 강조하면 아무것도 강조 안 됨").
2. **기준 = 에버그린 대표작.** ① 지금도 정확/유효하고 ② 깊이를 보여주며 ③ 내 관심사를 대표하는 글만 고정한다.
3. **회전제.** 더 센 대표글이 나오면 약한 것을 내린다. 고정 세트를 "best of"로 굴린다.
4. **최상단 제어.** 맨 위에 두고 싶은 글은 *고정글 중 가장 최신 날짜*여야 한다.

**고정 금지군**

- 유틸/하우투성 글 (포맷 변환, 환경 복구 스니펫 등)
- 데모/보일러플레이트 (Chirpy 샘플 `how-to-write-a-new-post` 등)
- 시의성 글 (밋업·전형 후기 등 시간이 지나면 가치가 떨어지는 글)

**현재 상태 (정리 필요)**

> 2026-06 기준 25개 글 중 ~14개가 `pin: true`로 과다 고정되어 있고 데모 글도 포함되어 있다. 위 원칙(3~5개)에 맞게 대표작만 남기고 나머지는 `pin: false`로 정리할 것.

## 파일명 규칙

- 경로: `_posts/`
- 형식: `YYYY-MM-DD-슬러그.md`

예시:
- `2026-03-21-분산-시스템에서의-ID.md`

## 예약 발행 규칙

- 예약글은 `date`를 미래 시각으로 설정
- 워크플로우가 정기 빌드되어야 자동 반영됨

## 기본 템플릿

```yaml
---
title: 제목
date: 2026-03-21 21:00:00 +0900
description: 글의 핵심 주제를 1~2문장으로 요약합니다.
categories: [백엔드, 아키텍처]
tags: [kotlin, uuid, id-generator]
image:
  path: /assets/img/posts/2026/example.png
  alt: 대표 이미지 설명
pin: false
published: true
---
```
