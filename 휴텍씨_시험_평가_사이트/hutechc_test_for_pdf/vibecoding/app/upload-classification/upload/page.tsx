import { ClassificationRuleSelector } from "@/components/ClassificationRuleSelector";
import { ClassificationStepTabs } from "@/components/ClassificationStepTabs";
import { FileUploadDropzone } from "@/components/FileUploadDropzone";
import { ClassificationResultTable } from "@/components/ClassificationResultTable";
import { UploadClassificationShell } from "@/components/UploadClassificationShell";
import { classificationRows, initialJob, uploadedFiles } from "@/lib/fixtures";

export default function UploadPage() {
  return (
    <UploadClassificationShell title="회원관리" active="파일업로드">
      <ClassificationStepTabs job={initialJob} />
      <FileUploadDropzone />
      <section className="file-list" aria-label="업로드 파일 목록">
        {uploadedFiles.map((file) => (
          <article key={file.id}>
            <strong>{file.name}</strong>
            <span>{file.size}</span>
            <span>{file.status}</span>
            <span>{file.rows.toLocaleString()}행</span>
          </article>
        ))}
      </section>
      <ClassificationRuleSelector />
      <ClassificationResultTable rows={classificationRows} />
    </UploadClassificationShell>
  );
}
