# figma_pdf와 design_resource 비교 분석 프롬프트

## 1) 목적

figma_pdf 기반 자료와 design_resource 기반 자료를 비교 분석하여,
각 방식이 문서 품질과 개발 구현 용이성에 미치는 영향을 평가한다.
또한 현재 구현체인 hutechc_app과 비교하여, design_resource/docs를 반영했을 때
기능 고도화가 어느 수준까지 가능한지 판단한다.

## 2) 입력 자료

- figma_pdf
  - 2024/2025/바이브 PDF 전체 추출
  - md 문서 및 분석 기반 pdf 포함
  - 위치: `./hutechc_pdf기반*도출자료`
- design_resource
  - 각 프레임별 JPG 추출 및 폴더 정리
  - 위치: `../hutechc_design_resource`
- hutechc_app
  - 현재 구현된 Next.js 기반 시험 포털
  - 수험자/전문가/채점자/운영자 역할별 화면과 일부 mock/localStorage 동작 포함
  - 위치: `../hutechc_app`

## 3) 분석 요청 사항

1. figma_pdf 기반으로 md가 생성되었을 때 부실했던 이유 분석
2. design_resource 기반 도출 시 구현 용이성과 md 상세화 가능성 평가
3. figma_pdf vs design_resource 방식에 따른 구현 가능성 비교 분석
4. design_resource의 docs에 별도 md 문서를 만들었을 때 개발 용이성 증대 효과 정리
5. 현재 hutechc_app 구현 범위 분석
6. hutechc_app을 기준으로 design_resource/docs를 흡수했을 때 가능한 기능 고도화 범위 정리
7. mock/localStorage 기반 프로토타입, 운영 준비형 프론트엔드, 실제 운영 제품의 경계 구분

## 4) 산출물

- `figma_pdf_vs_design_resource_analysis.md`: figma_pdf와 design_resource 비교 분석
- `hutechc_app_advancement_scope.md`: hutechc_app 기준 기능 고도화 범위 분석
- 필요 시 역할/작업 기준은 `role.md`에 별도 정리
