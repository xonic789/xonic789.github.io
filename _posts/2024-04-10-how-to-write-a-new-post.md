---
title: jekyll chirpy theme 사용법
date: 2024-04-10 19::15 +0900
categories: [깃허브블로그]
---

## 이름 지정과 경로
새로운 파일의 이름은 `YYYY-MM-DD-TITLE.EXTENSION` 형식으로 작성하고, _posts 디렉토리에 위치해야합니다.
파일의 `EXTENSION`은 `.md` 또는 `.markdown`이어야합니다.
파일을 생성하기 위해서 시간을 아끼려면 [Jekyll-Compose](https://github.com/jekyll/jekyll-compose) 를 사용할 수 있습니다.

## 서문 작성
파일의 맨 위에는 YAML Front Matter가 있어야합니다. 이것은 파일의 메타데이터를 정의하는데 사용됩니다.
```yaml
---
title: TITLE
date: YYYY-MM-DD HH:MM:SS +/-TTTT
categories: [TOP_CATEGORIE, SUB_CATEGORIE]
tags: [TAG]     # TAG names should always be lowercase
---
```

### 시간대(타임존)
게시물의 작성일을 정확하게 기록하기 위해서는 _config.yml 파일 뿐만아니라 게시물의 서문에 시간대를 명시해야합니다.
> `+/-TTTT`는 UTC 시간과의 차이를 나타냅니다. 예를 들어, 한국 시간은 `+0900`입니다.

### 카테고리와 태그
카테고리는 최대 두 개 요소를 포함하도록 디자인 되어있고, 태그는 0개에서 무한대를 사용할 수 있습니다.

### 작성자 정보
작성자 정보를 추가하려면 `_data/authors.yml` 파일에 작성자 정보를 추가해야합니다.
```yaml
<author_id>:
  name: <full name>
  twitter: <twitter_of_author>
  url: <homepage_of_author>
```

## 목차 작성
`[TOC]`를 사용하여 목차를 생성할 수 있습니다. 이것은 페이지의 제목을 기반으로 목차를 생성합니다.
