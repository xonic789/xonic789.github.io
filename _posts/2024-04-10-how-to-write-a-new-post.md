---
title: jekyll chirpy theme 사용법
date: 2024-04-10 19::15 +0900
categories: [깃허브블로그]
pin: true
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
그런 다음 작성자를 지정하는 데 author를 사용하거나 여러 항목을 지정하는 데 authors를 사용합니다:

``` yaml
author: <작성자 아이디>                     # 단일 항목의 경우
# 또는
authors: [<작성자1 아이디>, <작성자2 아이디>]   # 여러 항목의 경우
```

## 목차 작성
기본적으로 목차(TOC)는 포스트의 오른쪽 패널에 표시됩니다. 전역적으로 끄려면 _config.yml로 이동하여 변수 toc의 값을 false로 설정하세요. 특정 포스트의 목차를 끄려면 다음을 포스트의 프론트 매터에 추가하세요:
```yaml
---
toc: false
---
```

## 댓글
_config.yml 파일의 comments.active 변수에 의해서 글로벌 댓글 기능이 정의됩니다. 이 변수에 댓글 시스템을 선택한 후, 모든 게시물에 대해 댓글이 활성화 됩니다.
또한, 특정 포스트의 댓글을 끄려면 다음을 포스트의 프론트 매터에 추가하세요:
```yaml
---
comments: false
---
```

## Mermaid
Mermaid는 훌륭한 다이어그램 생성 도구입니다. 게시물에서 이를 활성화하려면 YAML 블록에 다음을 추가하십시오:
```yaml
---
mermaid: true
---
```

## 이미지
### 캡션
이미지의 다음 줄에 기울임을 추가하면 캡션으로 처리되어 이미지 하단에 나타납니다.
```markdown
![이미지 설명](/경로/이미지)
_이미지 캡션_
```
### 크기
이미지가 로드될 때 페이지 내용 레이아웃이 변하지 않도록 각 이미지의 너비와 높이를 설정해야 합니다:
```markdown
![데스크톱 뷰](/assets/img/sample/mockup.png){: width="700" height="400" }
```
SVG의 경우 최소한 너비를 지정해야 합니다. 그렇지 않으면 렌더링되지 않습니다:
![데스크톱 뷰](/assets/img/sample/mockup.png){: w="700" h="400" }
위와 같이 width 및 height를 약어로 사용할 수 있습니다.
### 위치
기본적으로 이미지는 가운데 정렬되지만, normal, left, right 클래스 중 하나를 사용하여 위치를 지정할 수 있습니다.

한 번 위치가 지정되면 이미지 캡션을 추가해서는 안됩니다.

기본 위치
```markdown
이미지가 왼쪽에 정렬됩니다:
![데스크톱 뷰](/assets/img/sample/mockup.png){: .normal }
```
```markdown
왼쪽에 띄우기
![데스크톱 뷰](/assets/img/sample/mockup.png){: .left }
```
```markdown
오른쪽에 띄우기
![데스크톱 뷰](/assets/img/sample/mockup.png){: .right }
```
### 그림자
프로그램 창의 스크린샷을 표시할 때 그림자 효과를 보여줄 수 있습니다:
```markdown
![데스크톱 뷰](/assets/img/sample/mockup.png){: .shadow }
```
### CDN URL
이미지를 CDN에 호스팅하는 경우, 모든 이미지의 경로 앞에 반복해서 CDN URL을 작성하지 않아도 됩니다. 이를 위해 _config.yml 파일의 img_cdn 변수를 할당할 수 있습니다:
```yaml
img_cdn: https://cdn.com
```
img_cdn이 할당되면 /로 시작하는 모든 이미지의 경로에 CDN 접두사 https://cdn.com이 추가됩니다.
예를 들어, 이미지를 사용하는 경우:
```markdown
![꽃](/경로/꽃.png)
```
구문 분석 결과 이미지 경로 앞에 CDN 접두사 https://cdn.com이 자동으로 추가됩니다:
```html
<img src="https://cdn.com/경로/꽃.png" alt="꽃" />
```
### 이미지 경로
게시물에 여러 이미지가 포함된 경우, 이미지의 경로를 반복해서 정의하는 것은 시간이 많이 걸릴 수 있습니다. 이를 해결하기 위해 게시물의 YAML 블록에서 이 경로를 정의할 수 있습니다:
```yaml
---
img_path: /img/경로/
---
```
그런 다음 Markdown의 이미지 소스에서 파일 이름을 직접 작성할 수 있습니다:
```markdown
![꽃](flower.png)
```
결과는 다음과 같습니다.
```html
<img src="/img/경로/flower.png" alt="꽃" />
```
## 미리보기 이미지
게시물 상단에 이미지를 추가하려면 1200 x 630 해상도의 이미지를 제공하십시오. 이미지의 종횡비가 1.91 : 1에 부합하지 않는 경우 이미지가 크기 조정되고 잘려납니다.

이러한 전제조건을 알고 나면 이미지의 속성을 설정할 수 있습니다:
```yaml
---
image:
  path: /경로/이미지
  alt: 이미지 대체 텍스트
---
```
img_path도 미리보기 이미지에 전달될 수 있으며, 설정된 경우 path 속성에 이미지 파일 이름만 필요합니다.

간단한 사용을 위해 이미지만 사용하여 경로를 정의할 수도 있습니다.
```yaml
---
image: /경로/이미지
---
```
### 고정된 게시물
홈 페이지 상단에 하나 이상의 게시물을 고정할 수 있으며, 고정된 게시물은 발행 날짜를 기준으로 역순으로 정렬됩니다. 다음으로 활성화할 수 있습니다:
```yaml
---
pin: true
---
```

나머지 프롬프트, Syntax, 비디오 등은 직접 가셔서 보시길 바랍니다! ㅎㅎ
[chirpy theme](https://chirpy.cotes.page/posts/write-a-new-post/)
