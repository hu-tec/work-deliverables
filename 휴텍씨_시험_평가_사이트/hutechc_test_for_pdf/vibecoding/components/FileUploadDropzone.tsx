"use client";

import { useMemo, useState } from "react";
import { validateUploadFile, type UploadValidation } from "@/lib/classification-state";

export function FileUploadDropzone() {
  const [fileName, setFileName] = useState("회원_시험결과_2501.xlsx");
  const [fileSize, setFileSize] = useState(1024 * 1024 * 8);

  const validation = useMemo<UploadValidation>(() => validateUploadFile({ name: fileName, size: fileSize }), [fileName, fileSize]);

  return (
    <section className="dropzone" aria-label="파일 업로드">
      <div>
        <strong>파일을 선택하거나 이 영역에 놓아주세요.</strong>
        <p>CSV, XLS, XLSX 형식과 20MB 이하 파일을 지원합니다.</p>
      </div>
      <div className="upload-controls">
        <label>
          파일명
          <input value={fileName} onChange={(event) => setFileName(event.target.value)} />
        </label>
        <label>
          크기
          <select value={fileSize} onChange={(event) => setFileSize(Number(event.target.value))}>
            <option value={1024 * 1024 * 8}>8MB</option>
            <option value={1024 * 1024 * 24}>24MB</option>
          </select>
        </label>
        <button className="secondary-button">파일올리기</button>
      </div>
      <FileValidationSummary validation={validation} />
    </section>
  );
}

export function FileValidationSummary({ validation }: { validation: UploadValidation }) {
  if (validation.ok) {
    return <p className="validation-ok">검증 정상: 업로드 후 구분 처리를 시작할 수 있습니다.</p>;
  }

  return (
    <ul className="validation-errors" aria-label="파일 검증 오류">
      {validation.errors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  );
}
