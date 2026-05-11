---
title: GitHub SSH 인증 충돌과 origin 복구
date: '2026-05-11 21:00:00 +0900'
description: GitHub CLI 로그인 상태만 보고 있으면 SSH 기반 Git push 인증 충돌의 원인을 놓치기 쉽다. 실제로는 origin
  URL보다 SSH host alias와 IdentityFile 매핑이 더 결정적이라는 점을 정리한 글이다.
categories:
- 개발환경
- Git
tags:
- git
- github
- ssh
- multi-account
- origin
pin: false
published: true
---

## 상황

- `xonic789/xonic789.github.io` 저장소에서 `git push origin main`이 실패했다.
- 에러는 `Permission to xonic789/xonic789.github.io.git denied to tnearSeungWoo.` 형태였다.
- 커밋 작성자 정보와 원격 저장소 이름은 의도한 값처럼 보였지만, 실제 인증 계정이 달랐다.

## 원인

- `origin` URL 자체는 `git@github.com:xonic789/xonic789.github.io.git`로 올바르게 설정되어 있었다.
- 하지만 이 URL은 `~/.ssh/config`의 기본 `Host github.com` 설정을 타고 있었다.
- 기본 `github.com` 호스트는 `~/.ssh/id_ed25519`를 사용했고, 이 키는 의도한 `xonic789` 계정이 아니라 다른 계정 흐름으로 연결되어 있었다.
- 반면 개인용 별칭 `github-personal`은 `~/.ssh/id_ed25519_github_personal`을 사용하도록 분리되어 있었고, 이 키는 `xonic789` 계정에 매핑되어 있었다.

## 확인 과정

- `gh auth status`로 보면 `xonic789`와 `tnearSeungWoo`가 모두 로그인되어 있었지만, Git push는 GitHub CLI 로그인 상태가 아니라 SSH 설정을 따른다.
- `ssh -T github.com`은 의도한 계정으로 인증되지 않았다.
- `ssh -T github-personal`은 `Hi xonic789!` 응답을 반환했다.
- 따라서 문제는 원격 URL 문자열보다도, 어떤 SSH host alias와 어떤 키를 통해 접속하느냐에 있었다.

## 해결

### 1. 로컬 저장소의 Git 작성자 정보 고정

현재 저장소에만 아래 값을 설정했다.

```bash
git config user.name "xonic789"
git config user.email "xonic789@naver.com"
```

마지막 커밋은 아래 명령으로 새 작성자 정보로 다시 기록했다.

```bash
git commit --amend --reset-author --no-edit
```

### 2. 저장소별 origin을 개인용 SSH alias로 변경

이 저장소의 `origin`만 아래처럼 변경했다.

```bash
git remote set-url origin github-personal:xonic789/xonic789.github.io.git
```

변경 후 원격 확인:

```bash
git remote -v
```

출력은 fetch/push 모두 `github-personal:xonic789/xonic789.github.io.git`를 가리켰다.

### 3. 원격 읽기 테스트 후 push

먼저 아래 명령으로 읽기 접근을 확인했다.

```bash
git ls-remote origin -h refs/heads/main
```

그 다음 push를 실행했고 정상 반영되었다.

```bash
git push origin main
```

## 정리된 원칙

- GitHub CLI 로그인 상태와 Git SSH 인증 경로는 별개다.
- 여러 GitHub 계정을 동시에 쓰면 `github.com` 기본 호스트에 의존하지 않는 편이 안전하다.
- 저장소별로 `github-personal` 같은 host alias를 두고, 해당 alias에 전용 `IdentityFile`을 연결하는 방식이 충돌을 줄인다.
- 작성자 정보 변경은 글로벌이 아니라 저장소 로컬 설정으로 두면 다른 저장소에 영향을 주지 않는다.

## 후속 체크 포인트

- 다른 개인 저장소들도 동일한 `github-personal` alias를 사용하도록 정리할지 검토한다.
- `~/.ssh/config`에서 `github.com` 기본 호스트가 어떤 계정/키를 타는지 명확히 문서화해두는 것이 좋다.
- 계정이 여러 개라면 저장소 생성/클론 시점부터 remote URL을 alias 기준으로 맞추는 습관이 안전하다.
