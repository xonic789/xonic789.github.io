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
- `pin`: 기본 `false` (홈 고정이 필요할 때만 `true`)

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
