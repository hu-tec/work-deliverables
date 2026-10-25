# iframe 신청서 사용법

이 문서는 `apply-form-example.html` 신청서를 다른 페이지에 iframe으로 삽입하는 방법을 설명합니다.

iframe 방식은 신청서 파일을 페이지 안에 직접 복사하지 않고, 별도 주소로 불러오는 방식입니다. 부모 페이지는 iframe 주소만 지정하고, 신청서의 테마나 기본 신청 유형은 URL 파라미터로 조정합니다.

## 1. 기본 삽입 코드

가장 기본적인 삽입 코드는 다음과 같습니다.

```html
<iframe
  src="apply-form-example.html"
  title="TESOL 신청서"
  style="width: 100%; min-height: 820px; border: 0;"
></iframe>
```

이렇게 넣으면 기본 테마와 기본 신청 유형인 `수업신청`으로 표시됩니다.

## 2. 주소로 설정 바꾸기

iframe의 `src` 주소 뒤에 `?`를 붙이고 설정값을 넣으면 신청서 동작을 바꿀 수 있습니다.

예시:

```html
<iframe
  src="apply-form-example.html?theme=green&type=레벨테스트"
  title="레벨테스트 신청서"
  style="width: 100%; min-height: 820px; border: 0;"
></iframe>
```

위 코드는 다음 의미입니다.

| 설정 | 값 | 의미 |
| --- | --- | --- |
| `theme` | `green` | 그린 테마로 표시 |
| `type` | `레벨테스트` | 처음 선택된 신청 유형을 레벨테스트로 설정 |

## 3. 사용할 수 있는 파라미터

| 파라미터 | 필수 여부 | 설명 | 예시 |
| --- | --- | --- | --- |
| `theme` | 선택 | 신청서 색상 테마 | `theme=tesol` |
| `type` | 선택 | 처음 선택될 신청 유형 | `type=레벨테스트` |
| `api` | 선택 | 신청서 제출 API 주소 | `api=https%3A%2F%2Fexample.com%2Fapi%2Fapply` |
| `allowedTypes` | 선택 | 화면에 노출할 신청 유형 제한 | `allowedTypes=레벨테스트` |

파라미터가 없으면 기본값이 사용됩니다.

| 항목 | 기본값 |
| --- | --- |
| 테마 | `tesol` |
| 신청 유형 | `수업신청` |
| API 주소 | 없음, 데모 제출 처리 |
| 노출 신청 유형 | 전체 노출 |

## 4. 테마 목록

현재 예시 HTML에서 사용할 수 있는 테마는 다음과 같습니다.

| 테마 값 | 화면 분위기 | 추천 사용처 |
| --- | --- | --- |
| `tesol` | 버건디 포인트 | TESOL 기본 페이지 |
| `neutral` | 차분한 회색/검정 | 공통 신청 페이지 |
| `green` | 녹색 포인트 | 교육/상담형 페이지 |
| `blue` | 파란색 포인트 | 신뢰감 있는 안내 페이지 |
| `teal` | 청록색 포인트 | AI/기술 교육 페이지 |
| `indigo` | 인디고 포인트 | 전문 과정/심화 과정 |
| `rose` | 로즈 포인트 | 이벤트/프로모션 페이지 |
| `amber` | 앰버 포인트 | 설명회/오프라인 안내 |
| `mono` | 흑백 중심 | 미니멀한 페이지 |
| `soft` | 부드러운 뉴트럴 톤 | 밝고 조용한 랜딩 페이지 |
| `dark` | 어두운 배경 | 다크 랜딩 페이지 |

예시:

```html
<iframe
  src="apply-form-example.html?theme=blue&type=설명회신청"
  title="설명회 신청서"
  style="width: 100%; min-height: 820px; border: 0;"
></iframe>
```

## 5. 신청 유형 설정

`type`에는 다음 값을 사용할 수 있습니다.

| type 값 | 용도 |
| --- | --- |
| `수업신청` | 일반 수업 신청 |
| `레벨테스트` | 레벨테스트 신청 |
| `설명회신청` | 설명회 신청 |
| `테스트 TIP 신청` | 테스트 TIP 자료/문의 신청 |
| `1:1문의` | 문의 신청 |

브라우저 주소에 한글이 들어가도 대부분 동작하지만, 실제 운영에서는 URL 인코딩된 주소를 쓰는 것이 안전합니다.

예를 들어 `레벨테스트`는 주소 안에서 다음처럼 표시될 수 있습니다.

```text
%EB%A0%88%EB%B2%A8%ED%85%8C%EC%8A%A4%ED%8A%B8
```

직접 인코딩이 어렵다면 `iframe-embed-demo.html`에서 값을 선택한 뒤 생성된 주소를 사용하면 됩니다.

## 6. 신청 유형을 하나만 보이게 하기

특정 페이지에서는 신청 유형 탭 전체를 보여주지 않고 하나만 보이게 할 수 있습니다.

예시:

```html
<iframe
  src="apply-form-example.html?theme=green&type=레벨테스트&allowedTypes=레벨테스트"
  title="레벨테스트 신청서"
  style="width: 100%; min-height: 820px; border: 0;"
></iframe>
```

위 예시는 레벨테스트 탭만 노출합니다.

여러 개만 노출하고 싶다면 쉼표로 구분합니다.

```html
<iframe
  src="apply-form-example.html?theme=tesol&type=수업신청&allowedTypes=수업신청,설명회신청"
  title="수업 및 설명회 신청서"
  style="width: 100%; min-height: 820px; border: 0;"
></iframe>
```

## 7. API 호출 연결

`api` 파라미터에 제출 API 주소를 넣으면 사용자가 제출할 때 해당 주소로 POST 요청을 보냅니다.

예시:

```html
<iframe
  src="apply-form-example.html?theme=tesol&type=수업신청&api=https%3A%2F%2Fexample.com%2Fapi%2Fapply"
  title="수업 신청서"
  style="width: 100%; min-height: 820px; border: 0;"
></iframe>
```

실제 원본 API를 연결하는 예시는 다음과 같습니다.

```html
<iframe
  src="apply-form-example.html?theme=tesol&type=수업신청&api=https%3A%2F%2Fbmidcy9z17.execute-api.ap-northeast-2.amazonaws.com%2Fapi%2Ftesol_expert_applications"
  title="TESOL 신청서"
  style="width: 100%; min-height: 820px; border: 0;"
></iframe>
```

주의할 점:

1. API 서버가 해당 페이지에서 오는 요청을 허용해야 합니다.
2. 이를 CORS 허용이라고 부릅니다.
3. CORS가 허용되지 않으면 브라우저가 제출 요청을 차단합니다.
4. 개인정보가 포함되므로 API 주소는 반드시 HTTPS를 사용해야 합니다.

## 8. iframe 높이 자동 조절

신청서는 Step에 따라 높이가 달라질 수 있습니다. 부모 페이지에서 `postMessage` 이벤트를 받으면 iframe 높이를 자동으로 조절할 수 있습니다.

예시:

```html
<iframe id="applyFrame" src="apply-form-example.html" title="TESOL 신청서"></iframe>

<script>
  const frame = document.querySelector("#applyFrame");

  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.type !== "tesol-apply-form:height") return;

    frame.style.height = `${Math.max(data.height, 720)}px`;
  });
</script>
```

`apply-form-example.html`은 내부 높이가 바뀔 때 부모 페이지로 다음 메시지를 보냅니다.

```json
{
  "type": "tesol-apply-form:height",
  "height": 920
}
```

## 9. 제출 완료 이벤트 받기

신청서 제출이 성공하면 부모 페이지로 제출 완료 이벤트를 보냅니다.

부모 페이지 예시:

```html
<script>
  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.type !== "tesol-apply-form:submitted") return;

    console.log("신청 유형:", data.applicationType);
    console.log("신청자 이름:", data.payload.basic.name);
  });
</script>
```

전달되는 메시지 예시는 다음과 같습니다.

```json
{
  "type": "tesol-apply-form:submitted",
  "applicationType": "수업신청",
  "payload": {
    "basic": {
      "name": "홍길동",
      "phone": "010-1234-5678"
    }
  }
}
```

## 10. 데모 파일 사용법

`iframe-embed-demo.html`을 열면 테마, 신청 유형, API 주소를 선택해서 iframe 주소를 자동으로 만들 수 있습니다.

사용 순서:

1. `iframe-embed-demo.html`을 브라우저에서 엽니다.
2. 테마를 선택합니다.
3. 기본 신청 유형을 선택합니다.
4. API 주소를 입력하거나 데모 상태로 둡니다.
5. 생성된 iframe 주소를 확인합니다.

## 11. 운영 적용 시 권장 방식

운영 환경에서는 `api` 주소를 사용자가 마음대로 바꾸게 두지 않는 것이 좋습니다. 보안상 허용된 API만 호출하도록 제한하는 방식이 안전합니다.

권장 방식:

```text
나쁜 방식: ?api=https://아무주소
좋은 방식: ?apiKey=tesol-main
```

예를 들어 `apiKey=tesol-main`이면 내부 코드에서 미리 정해둔 API 주소로만 전송하게 만들 수 있습니다.

```js
const allowedApis = {
  "tesol-main": "https://example.com/api/apply",
  "level-test": "https://example.com/api/level-test"
};
```

이렇게 하면 외부에서 임의의 API 주소를 넣어 개인정보가 다른 곳으로 전송되는 문제를 막을 수 있습니다.

## 12. 빠른 예시 모음

TESOL 기본 신청서:

```html
<iframe src="apply-form-example.html?theme=tesol&type=수업신청"></iframe>
```

레벨테스트 전용 신청서:

```html
<iframe src="apply-form-example.html?theme=green&type=레벨테스트&allowedTypes=레벨테스트"></iframe>
```

설명회 전용 신청서:

```html
<iframe src="apply-form-example.html?theme=amber&type=설명회신청&allowedTypes=설명회신청"></iframe>
```

1:1 문의 전용 신청서:

```html
<iframe src="apply-form-example.html?theme=neutral&type=1:1문의&allowedTypes=1:1문의"></iframe>
```

다크 테마 신청서:

```html
<iframe src="apply-form-example.html?theme=dark&type=수업신청"></iframe>
```
