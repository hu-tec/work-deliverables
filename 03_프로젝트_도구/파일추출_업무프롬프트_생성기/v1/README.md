# 파일 추출 + 업무 프롬프트 생성기 MVP

## 실행

Windows에서는 `run_app.bat`를 더블클릭합니다.

배치 파일 실행이 막히면 `run_app.vbs`를 더블클릭합니다.

```bash
python app.py
```

Windows에서 `python` 명령이 안 되면 `py -3 app.py`로 실행합니다.

## exe 빌드

Windows에서 아래 파일을 실행합니다.

```bat
build_exe_ascii.bat
```

완료 후 실행 파일은 `dist/file_prompt_generator.exe`에 생성됩니다.

## MVP 구현 범위

- 폴더 선택 후 파일 검색
- 확장자, 기간, 필수/강화/보류/제외 키워드 필터
- 최신본/최종본 가중치 기반 관련도 점수
- 검색 결과 미리보기
- 선택 파일 복사
- 5개 업무 생성기별 프롬프트 생성
- 프롬프트 복사 및 Markdown 저장

`docx`와 `pdf` 본문 검색은 `requirements.txt` 설치 후 동작합니다. `xlsx`, `pptx`, `hwp`는 MVP에서 파일명 기준으로 검색합니다.
