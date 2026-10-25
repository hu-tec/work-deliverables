# Codex 자동 승인 모드를 현재 폴더로 제한해서 사용하는 방법

이 문서는 Codex를 사용할 때 매번 승인하지 않고도 자주 쓰는 명령을 자동 승인하되, 파일 쓰기 권한은 현재 프로젝트 폴더 안으로 제한하는 방법을 정리한 것입니다.

핵심은 두 가지입니다.

1. 파일 시스템 권한은 `workspace-write`로 둔다.
2. 자동 승인은 필요한 명령 prefix만 좁게 허용한다.

## 바로 실행하는 방법

현재 폴더를 작업 루트로 두고, 현재 폴더 안에서만 쓰기 가능한 상태로 Codex를 실행하려면 프로젝트 폴더에서 아래처럼 실행합니다.

```bash
cd /path/to/my-project
codex --sandbox workspace-write
```

짧은 옵션으로는 이렇게 쓸 수 있습니다.

```bash
cd /path/to/my-project
codex -s workspace-write
```

특정 폴더를 작업 루트로 지정해서 실행하려면 `--cd`를 같이 사용합니다.

```bash
codex --cd /path/to/my-project --sandbox workspace-write
```

짧은 옵션으로는 다음과 같습니다.

```bash
codex -C /path/to/my-project -s workspace-write
```

## 현재 폴더 제한 + 승인 질문 최소화

승인 질문 없이 진행하게 하려면 `--ask-for-approval never`를 붙입니다.

```bash
cd /path/to/my-project
codex --sandbox workspace-write --ask-for-approval never
```

짧은 옵션으로는 이렇게 쓸 수 있습니다.

```bash
cd /path/to/my-project
codex -s workspace-write -a never
```

이 조합의 의미는 다음과 같습니다.

- `-s workspace-write`: 현재 작업 폴더 안에서는 쓰기를 허용한다.
- `-a never`: 명령 실행 전에 승인 질문을 하지 않는다.
- 현재 폴더 밖에 쓰는 명령은 샌드박스 때문에 실패한다.

즉, 자동 승인처럼 동작하게 만들고 싶다면 아래 명령이 기본 추천값입니다.

```bash
codex -s workspace-write -a never
```

단, 이 설정은 승인 질문을 줄이는 설정이지 모든 위험을 없애는 설정은 아닙니다. 현재 폴더 안의 파일 삭제나 변경은 가능하므로 Git 저장소라면 먼저 커밋하거나 백업해 두는 것이 좋습니다.

## 권장 설정

현재 폴더에서만 파일을 만들거나 수정하게 하려면 Codex 세션의 권한 모델을 다음처럼 유지합니다.

```text
sandbox_mode = workspace-write
```

`workspace-write`는 기본적으로 현재 작업 폴더와 명시적으로 허용된 writable root 안에서만 쓰기를 허용합니다. 다른 폴더를 수정해야 하는 명령은 별도 승인이 필요합니다.

자동 승인은 파일 시스템 전체 권한을 푸는 방식이 아니라, 반복적으로 쓰는 안전한 명령 prefix만 허용하는 방식으로 설정하는 것이 좋습니다.

예를 들어 프로젝트 안에서 테스트만 자동 승인하려면 다음과 같은 prefix를 허용합니다.

```text
npm test
npm run test
pnpm test
yarn test
cargo test
pytest
```

개발 서버 실행만 자동 승인하려면 다음처럼 좁게 둡니다.

```text
npm run dev
pnpm dev
yarn dev
```

## 피해야 할 설정

다음처럼 너무 넓은 자동 승인은 피해야 합니다.

```text
python
node
bash
sh
zsh
rm
git
```

이런 prefix는 사실상 임의 명령 실행에 가깝거나, 삭제 및 외부 변경을 너무 쉽게 허용할 수 있습니다.

특히 아래 명령은 자동 승인 대상으로 두지 않는 것이 안전합니다.

```text
rm
rm -rf
git reset
git checkout
git clean
sudo
chmod
chown
mv
```

삭제, 권한 변경, Git 되돌리기, 시스템 권한 상승은 항상 수동 승인으로 남겨두는 편이 안전합니다.

## 현재 폴더만 허용하는 실전 운영 방식

1. Codex를 프로젝트 루트 폴더에서 실행합니다.

   ```bash
   cd /path/to/my-project
   codex -s workspace-write -a never
   ```

2. 세션 권한은 `workspace-write`를 사용합니다.

   이 상태에서는 현재 프로젝트 폴더 밖에 쓰는 작업이 제한됩니다.

3. 자동 승인은 필요한 명령 단위로만 추가합니다.

   예를 들어 `npm run test`를 자주 실행한다면, 자동 승인 rule은 `npm` 전체가 아니라 다음처럼 둡니다.

   ```text
   ["npm", "run", "test"]
   ```

4. 네트워크가 필요한 설치 명령은 자동 승인하지 않습니다.

   예를 들어 아래 명령은 매번 확인하는 편이 안전합니다.

   ```bash
   npm install
   pnpm install
   pip install
   cargo install
   brew install
   ```

5. 삭제 명령은 자동 승인하지 않습니다.

   현재 폴더 안이라고 해도 실수로 중요한 파일을 지울 수 있으므로 `rm`, `git clean`, `git reset --hard`는 직접 확인 후 승인합니다.

## 추천 자동 승인 예시

프론트엔드 프로젝트라면 보통 아래 정도가 적당합니다.

```text
["npm", "run", "dev"]
["npm", "run", "test"]
["npm", "run", "lint"]
["npm", "run", "build"]
```

Python 프로젝트라면 아래처럼 좁게 둡니다.

```text
["pytest"]
["ruff", "check"]
["ruff", "format"]
```

Rust 프로젝트라면 아래 정도가 적당합니다.

```text
["cargo", "test"]
["cargo", "check"]
["cargo", "fmt"]
["cargo", "clippy"]
```

## 안전 체크리스트

자동 승인 설정 전에 아래를 확인합니다.

- Codex를 프로젝트 루트에서 실행했는가?
- `sandbox_mode`가 `workspace-write`인가?
- writable root가 현재 프로젝트 폴더로 제한되어 있는가?
- 자동 승인 prefix가 너무 넓지 않은가?
- 삭제, 되돌리기, 권한 변경 명령은 자동 승인에서 제외했는가?
- 설치, 배포, 네트워크 작업은 수동 승인으로 남겨두었는가?

## 결론

가장 안전한 방식은 `workspace-write`로 현재 폴더 안의 쓰기만 허용하고, 자동 승인은 `npm run test`처럼 구체적인 명령 prefix만 등록하는 것입니다.

자동 승인 편의성을 높이고 싶더라도 `python`, `bash`, `git`, `rm`처럼 넓거나 위험한 prefix는 허용하지 않는 것이 좋습니다.
