(function (root) {
  'use strict';
  const topics = [
    {id: 'all', label: '전체', description: '등록된 Markdown 문서를 모두 봅니다. 목적별 탭을 선택하면 해당 문서만 표시합니다.'},
    {id: 'design-analysis', label: '디자인 분석', description: 'Figma와 디자인 리소스 비교, 신청서 화면 분석, 시안 도출 근거를 확인합니다.'},
    {id: 'design-rules', label: '디자인 기준', description: '디자인시스템, 레이아웃·밀도·컴포넌트 기준과 재사용 UI 제작 지침입니다.'},
    {id: 'site-analysis', label: '사이트 분석', description: '기존 사이트·인트라넷의 화면 목록, 사이트맵, 기능 분석과 FAQ 조사 자료입니다.'},
    {id: 'planning', label: '기획·기능정의', description: '서비스 방향, 요구사항, 기능 상세, 개발 설계와 구현 계획을 확인합니다.'},
    {id: 'manual', label: '매뉴얼·사용법', description: '도구 설치·실행·활용, 프로젝트 시작 안내와 운영 절차를 확인합니다.'},
    {id: 'data', label: 'DB·교육자료', description: 'DB 정제·검증·읽기 자료와 교육과정·시험 운영 콘텐츠를 모았습니다.'},
    {id: 'prompts', label: '작업 프롬프트', description: '특정 화면·도구의 생성·개선을 요청하는 작업 지시문입니다. 공통 UI 규칙은 디자인 기준 탭에 있습니다.'}
  ];

  function classify(doc) {
    const path = String(doc.path || '').replace(/\\/g, '/');
    const file = path.split('/').pop() || '';
    const title = String(doc.title || '');
    // Content purpose takes precedence over the parent folder's broad category.
    if (/\/(?:DB_정리|DB_정제_설명문서|DB_원본_엑셀)\//.test(path) || file === 'courses-description.md') return 'data';
    if (/시험사이트_분석|사이트맵_기능정의|vibecoding_화면분석|시험플랫폼_관점|PDF만으로_기능정의|인트라넷_화면목록/.test(path)) return 'site-analysis';
    if (/ITT_AI_시험홈페이지_분석|ITT_홈페이지 분석안|테솔_ITT_FAQ분석/.test(path) && file !== 'mandara.md') return 'site-analysis';
    if (/site.*analysis|(?:itt|tesol|translation).*faq/i.test(file)) return 'site-analysis';
    if (/figma_pdf_vs_design_resource_analysis|TESOL_신청서_양식_분석|aite-derivation-rationale/.test(file)) return 'design-analysis';
    if (/재사용_디자인_프롬프트|표2_카드형2_대중소분류/.test(path)) return 'design-rules';
    if (/^README\.md$/i.test(file) || /codex_매뉴얼|codex_자동승인|iframe_신청서_사용법|figma_mcp_(?:사용|활용)_가이드|convention\.md|PUSH_WORKFLOW/.test(path)) return 'manual';
    if (/기획안|수정안|구현계획|hutechc_app_advancement_scope/.test(file)) return 'planning';
    if (path.includes('/디자인리소스_Figma_비교/') && file === 'role.md') return 'prompts';
    if (/프롬프트|prompt/i.test(file) || path.includes('/AI_작업요청_프롬프트_가이드/')) return 'prompts';
    if (/디자인시스템/.test(path)) return 'design-rules';
    if (doc.section === '교육·시험·콘텐츠 자료') return 'data';
    if (/매뉴얼|사용법|설치|활용 가이드/.test(title)) return 'manual';
    return 'planning';
  }

  const api = {topics, classify};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MarkdownTopics = api;
})(typeof window !== 'undefined' ? window : globalThis);
