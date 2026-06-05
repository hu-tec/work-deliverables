const filterButtons = document.querySelectorAll("[data-filter]");
const componentCards = document.querySelectorAll("[data-component]");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    componentCards.forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.component !== filter;
    });
    });
});

document.querySelectorAll(".tabs").forEach((tabs) => {
    const tabItems = tabs.querySelectorAll(".tab-item");
    tabItems.forEach((tab) => {
    tab.addEventListener("click", () => {
        tabItems.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", String(isActive));
        });
    });
    });
});

const toastMessages = {
    info: ["새 알림이 있습니다.", "info"],
    success: ["저장되었습니다.", "success"],
    confirm: ["확인되었습니다.", "info"],
    warning: ["확인이 필요합니다.", "warning"],
    danger: ["처리하지 못했습니다.", "danger"]
};

function showToast(message, type = "success", position = "top-right") {
    const stack = document.querySelector("[data-toast-viewport]");
    if (!stack) return;

    stack.dataset.toastPosition = position;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="toast-dot"></i><span>${message}</span>`;
    stack.prepend(toast);
    window.setTimeout(() => toast.remove(), 3000);
}

document.querySelectorAll("[data-toast-demo]").forEach((button) => {
    button.addEventListener("click", () => {
    const [message, type] = toastMessages[button.dataset.toastDemo] || toastMessages.info;
    showToast(message, type, button.dataset.toastPosition || "top-right");
    });
});

const modal = document.querySelector("[data-modal]");
const modalOpen = document.querySelector("[data-modal-open]");
const modalCloseButtons = document.querySelectorAll("[data-modal-close], [data-modal-confirm]");

if (modalOpen && modal) {
    modalOpen.addEventListener("click", () => {
    modal.hidden = false;
    });
}

modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
    modal.hidden = true;
    if (button.hasAttribute("data-modal-confirm")) {
        showToast("확인되었습니다.", "info");
    }
    });
});

if (modal) {
    modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.hidden = true;
    });
}

const ruleChecks = document.querySelectorAll("[data-rule-check]");
const checkResult = document.querySelector("[data-check-result]");
const checkProgress = document.querySelector("[data-check-progress]");

function updateChecklist() {
    const completed = [...ruleChecks].filter((input) => input.checked).length;
    const total = ruleChecks.length;
    const finished = completed === total;
    checkResult.textContent = finished ? "점검 완료" : `${completed} / ${total} 완료`;
    checkResult.classList.toggle("off", !finished);
    checkProgress.style.width = `${(completed / total) * 100}%`;
}

ruleChecks.forEach((input) => input.addEventListener("change", updateChecklist));
updateChecklist();

const stateToggles = document.querySelectorAll("[data-state-toggle]");
const toggleOutput = document.querySelector("[data-toggle-output]");

stateToggles.forEach((input) => {
    input.addEventListener("change", () => {
    const status = input.checked ? "활성" : "비활성";
    toggleOutput.textContent = `${input.dataset.stateName} ${status}`;
    toggleOutput.classList.toggle("off", !input.checked);
    });
});

const viewButtons = document.querySelectorAll("[data-view-button]");
const viewPanels = document.querySelectorAll("[data-view-panel]");

viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
    viewButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
    });
    viewPanels.forEach((panel) => {
        panel.hidden = panel.dataset.viewPanel !== button.dataset.viewButton;
    });
    });
});

const previewDevice = document.querySelector("[data-preview-device]");
const previewSizeButtons = document.querySelectorAll("[data-preview-size]");

previewSizeButtons.forEach((button) => {
    button.addEventListener("click", () => {
    const mobile = button.dataset.previewSize === "mobile";
    previewDevice.classList.toggle("mobile", mobile);
    previewSizeButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
    });
    });
});

const previewModal = document.querySelector("[data-preview-modal]");
const previewOpen = document.querySelector("[data-preview-open]");
const previewClose = document.querySelector("[data-preview-close]");

previewOpen.addEventListener("click", () => {
    previewModal.hidden = false;
    previewClose.focus();
});

previewClose.addEventListener("click", () => {
    previewModal.hidden = true;
    previewOpen.focus();
});

previewModal.addEventListener("click", (event) => {
    if (event.target === previewModal) {
    previewModal.hidden = true;
    previewOpen.focus();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !previewModal.hidden) {
    previewModal.hidden = true;
    previewOpen.focus();
    }
});

const ruleFilterButtons = document.querySelectorAll("[data-rule-filter]");
const ruleSearch = document.querySelector("[data-rule-search]");
const ruleFilterItems = document.querySelectorAll("[data-filter-item]");
let activeRuleFilter = "all";

function updateRuleFilter() {
    const query = ruleSearch.value.trim().toLowerCase();
    ruleFilterItems.forEach((item) => {
    const matchesType = activeRuleFilter === "all" || item.dataset.filterItem === activeRuleFilter;
    const matchesText = !query || item.dataset.filterText.toLowerCase().includes(query);
    item.hidden = !matchesType || !matchesText;
    });
}

ruleFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
    activeRuleFilter = button.dataset.ruleFilter;
    ruleFilterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
    });
    updateRuleFilter();
    });
});
ruleSearch.addEventListener("input", updateRuleFilter);

const layoutChoices = document.querySelectorAll("[data-layout-choice]");
const layoutNote = document.querySelector("[data-layout-note]");
const layoutExample = document.querySelector("[data-layout-example]");
const layoutDescriptions = {
    "장문형": "해설, 매뉴얼, 긴 서비스 설명을 이어 읽는 구조로 표시합니다.",
    "질문·단답형": "질문과 간결한 답변을 한 줄 단위로 반복하는 구조로 표시합니다.",
    "4지선다형": "시험처럼 하나의 정답을 고르는 보기 구조로 표시합니다.",
    "단일 선택형": "설정 또는 카테고리에서 하나의 값만 확정하는 구조로 표시합니다."
};
const layoutExamples = {
    "장문형": `<strong>서비스 소개 원고</strong><p class="muted">고전 번역은 원문의 의미와 시대 맥락을 함께 전달하는 서비스입니다. 분야별 해설과 기술 기준을 충분히 서술합니다.</p>`,
    "질문·단답형": `<label class="label" for="short-answer-demo">Q. 적용할 대상 업무는?</label><input class="field" id="short-answer-demo" placeholder="예: 시험 랜딩페이지">`,
    "4지선다형": `<fieldset><legend>Q. 공통 틀에 포함되는 영역은?</legend><label class="answer-option"><input type="radio" name="quiz-sample"> Header / Sidebar / Content / Footer</label><label class="answer-option"><input type="radio" name="quiz-sample"> 광고 배너만 표시</label><label class="answer-option"><input type="radio" name="quiz-sample"> 문서 제목만 표시</label><label class="answer-option"><input type="radio" name="quiz-sample"> 분류를 사용하지 않음</label></fieldset>`,
    "단일 선택형": `<fieldset><legend>규정 등급 선택</legend><label class="answer-option"><input type="radio" name="grade-sample"> 고정 규정</label><label class="answer-option"><input type="radio" name="grade-sample"> 준고정 규정</label><label class="answer-option"><input type="radio" name="grade-sample"> 선택 규정</label></fieldset>`
};

layoutChoices.forEach((choice) => {
    choice.addEventListener("change", () => {
    if (choice.checked) {
        layoutNote.innerHTML = `<strong>${choice.value}</strong> 선택: ${layoutDescriptions[choice.value]}`;
        layoutExample.innerHTML = layoutExamples[choice.value];
    }
    });
});

const treeDetails = document.querySelectorAll("[data-rule-tree] details");
document.querySelector("[data-tree-expand]").addEventListener("click", () => {
    treeDetails.forEach((item) => { item.open = true; });
});
document.querySelector("[data-tree-collapse]").addEventListener("click", () => {
    treeDetails.forEach((item) => { item.open = false; });
});

const authorTypes = document.querySelectorAll("[data-author-type]");
const authorOutput = document.querySelector("[data-author-output]");
const authorTitle = document.querySelector("#rule-title-input");

function updateAuthoringState() {
    const selected = [...authorTypes].filter((input) => input.checked).map((input) => input.value);
    authorOutput.textContent = selected.length ? `${selected.join(" + ")} 작성중` : "분류 선택 필요";
    authorOutput.classList.toggle("off", selected.length === 0);
}

authorTypes.forEach((input) => input.addEventListener("change", updateAuthoringState));
updateAuthoringState();
document.querySelector("[data-author-new]").addEventListener("click", () => {
    authorTitle.value = "";
    document.querySelector("#rule-body-input").value = "";
    authorTitle.focus();
    showToast("새 규정 입력 영역을 준비했습니다.", "info");
});
document.querySelector("[data-author-save]").addEventListener("click", () => {
    const title = authorTitle.value.trim() || "제목 없음";
    showToast(`"${title}" 항목이 누적 관리 예시로 저장되었습니다.`, "success");
});

// 검색·필터 바: 칩 토글 + 활성 태그 제거 + 전체 해제
const filterBar = document.querySelector("[data-filter-bar]");
if (filterBar) {
    const activeArea = filterBar.querySelector("[data-filter-active]");
    const syncActiveTags = () => {
    const pressed = [...filterBar.querySelectorAll('.filter-chip[aria-pressed="true"]')]
        .map((chip) => chip.textContent.trim())
        .filter((label) => label !== "전체");
    const tags = pressed.map((label) =>
        `<span class="filter-tag">${label} <button type="button" aria-label="${label} 필터 제거">×</button></span>`
    ).join("");
    activeArea.innerHTML = tags + '<button class="filter-clear" type="button" data-filter-clear>필터 전체 해제</button>';
    };

    filterBar.querySelectorAll(".filter-group").forEach((group) => {
    const chips = group.querySelectorAll(".filter-chip");
    const isSort = group.querySelector(".filter-label")?.textContent.includes("정렬");
    const isClassify = group.querySelector(".filter-label")?.textContent.includes("분류");
    chips.forEach((chip) => {
        chip.addEventListener("click", () => {
        if (isSort) {
            // 정렬: 단일 선택
            chips.forEach((c) => c.setAttribute("aria-pressed", c === chip ? "true" : "false"));
        } else if (isClassify && chip.textContent.trim() === "전체") {
            // "전체" 선택 시 그룹 내 나머지 해제
            chips.forEach((c) => c.setAttribute("aria-pressed", c === chip ? "true" : "false"));
        } else {
            chip.setAttribute("aria-pressed", chip.getAttribute("aria-pressed") === "true" ? "false" : "true");
            if (isClassify) {
            const allChip = [...chips].find((c) => c.textContent.trim() === "전체");
            const anyOn = [...chips].some((c) => c !== allChip && c.getAttribute("aria-pressed") === "true");
            if (allChip) allChip.setAttribute("aria-pressed", anyOn ? "false" : "true");
            }
        }
        syncActiveTags();
        });
    });
    });

    filterBar.addEventListener("click", (e) => {
    // 활성 태그의 × 클릭 → 해당 칩 해제
    const tagBtn = e.target.closest(".filter-tag button");
    if (tagBtn) {
        const label = tagBtn.parentElement.textContent.replace("×", "").trim();
        filterBar.querySelectorAll(".filter-chip").forEach((chip) => {
        if (chip.textContent.trim() === label) chip.setAttribute("aria-pressed", "false");
        });
        // 분류 그룹이 비면 "전체" 복귀
        filterBar.querySelectorAll(".filter-group").forEach((group) => {
        if (!group.querySelector(".filter-label")?.textContent.includes("분류")) return;
        const chips = group.querySelectorAll(".filter-chip");
        const allChip = [...chips].find((c) => c.textContent.trim() === "전체");
        const anyOn = [...chips].some((c) => c !== allChip && c.getAttribute("aria-pressed") === "true");
        if (allChip && !anyOn) allChip.setAttribute("aria-pressed", "true");
        });
        syncActiveTags();
        return;
    }
    // 전체 해제
    if (e.target.closest("[data-filter-clear]")) {
        filterBar.querySelectorAll(".filter-group").forEach((group) => {
        const chips = group.querySelectorAll(".filter-chip");
        const isSort = group.querySelector(".filter-label")?.textContent.includes("정렬");
        chips.forEach((c, i) => {
            const txt = c.textContent.trim();
            c.setAttribute("aria-pressed", (txt === "전체" || (isSort && i === 0)) ? "true" : "false");
        });
        });
        filterBar.querySelector(".filter-search input").value = "";
        syncActiveTags();
    }
    });
}

const navCategories = document.querySelectorAll("[data-nav-category]");
const navPanels = document.querySelectorAll("[data-nav-panel]");
const sectionSubtabs = document.querySelectorAll("[data-section-subtabs]");

function updateSectionSubtabs(activeLink) {
    const target = activeLink?.getAttribute("href")?.replace("#", "");
    sectionSubtabs.forEach((subtabs) => {
    const active = subtabs.dataset.sectionSubtabs === target;
    subtabs.hidden = !active;
    if (active) {
        subtabs.querySelectorAll("a").forEach((link, index) => {
        link.classList.toggle("active", index === 0);
        });
    }
    });
}

navCategories.forEach((button) => {
    button.addEventListener("click", () => {
    const category = button.dataset.navCategory;
    navCategories.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
    });
    navPanels.forEach((panel) => {
        const active = panel.dataset.navPanel === category;
        panel.hidden = !active;
        panel.classList.toggle("active", active);
    });
    const firstLink = document.querySelector(`[data-nav-panel="${category}"] a`);
    if (firstLink) {
        document.querySelectorAll(".section-tabs a").forEach((link) => link.classList.remove("active"));
        firstLink.classList.add("active");
        updateSectionSubtabs(firstLink);
        window.location.hash = firstLink.getAttribute("href");
    }
    });
});

document.querySelectorAll(".section-tabs a").forEach((link) => {
    link.addEventListener("click", () => {
    document.querySelectorAll(".section-tabs a").forEach((item) => item.classList.toggle("active", item === link));
    updateSectionSubtabs(link);
    });
});

document.querySelectorAll(".section-subtabs a").forEach((link) => {
    link.addEventListener("click", () => {
    link.closest(".section-subtabs")?.querySelectorAll("a").forEach((item) => {
        item.classList.toggle("active", item === link);
    });
    });
});

function escapeHtml(value) {
    return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderInlineMarkdown(value) {
    return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="link" href="$2" target="_blank" rel="noopener">$1</a>');
}

function renderMarkdown(markdown) {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const html = [];
    let inCode = false;
    let code = [];
    let paragraph = [];
    let listType = null;
    let tableRows = [];

    const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
    };
    const flushList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
    };
    const flushTable = () => {
    if (!tableRows.length) return;
    const rows = tableRows.filter((row) => !/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(row));
    const renderedRows = rows.map((row, rowIndex) => {
        const cells = row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => renderInlineMarkdown(cell.trim()));
        const tag = rowIndex === 0 ? "th" : "td";
        return `<tr>${cells.map((cell) => `<${tag}>${cell}</${tag}>`).join("")}</tr>`;
    }).join("");
    html.push(`<table><tbody>${renderedRows}</tbody></table>`);
    tableRows = [];
    };
    const flushBlocks = () => {
    flushParagraph();
    flushList();
    flushTable();
    };

    lines.forEach((line) => {
    if (line.startsWith("```")) {
        if (inCode) {
        html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
        code = [];
        inCode = false;
        } else {
        flushBlocks();
        inCode = true;
        }
        return;
    }
    if (inCode) {
        code.push(line);
        return;
    }
    if (!line.trim()) {
        flushBlocks();
        return;
    }
    if (line.includes("|") && /^\s*\|?.+\|.+/.test(line)) {
        flushParagraph();
        flushList();
        tableRows.push(line);
        return;
    }
    flushTable();
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
        flushParagraph();
        flushList();
        const level = heading[1].length;
        html.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
        return;
    }
    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (unordered || ordered) {
        flushParagraph();
        const type = unordered ? "ul" : "ol";
        if (listType !== type) {
        flushList();
        html.push(`<${type}>`);
        listType = type;
        }
        html.push(`<li>${renderInlineMarkdown((unordered || ordered)[1])}</li>`);
        return;
    }
    const quote = line.match(/^>\s?(.+)$/);
    if (quote) {
        flushParagraph();
        flushList();
        html.push(`<blockquote>${renderInlineMarkdown(quote[1])}</blockquote>`);
        return;
    }
    paragraph.push(line.trim());
    });

    if (inCode) html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
    flushBlocks();
    return html.join("");
}

async function loadMarkdownDoc(src, title, viewer = document) {
    const docFrame = viewer.querySelector("[data-doc-frame]");
    const docRender = viewer.querySelector("[data-doc-render]");
    const docTitle = viewer.querySelector("[data-doc-current-title]");
    const docOpen = viewer.querySelector("[data-doc-open]");

    if (docTitle) docTitle.textContent = title;
    if (docOpen) docOpen.href = src;
    if (docFrame) {
    docFrame.src = src;
    return;
    }
    if (!docRender) return;
    docRender.innerHTML = "문서를 불러오는 중입니다.";
    try {
    const response = await fetch(src);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();
    docRender.innerHTML = renderMarkdown(markdown);
    } catch (error) {
    docRender.innerHTML = `<div class="doc-error"><strong>문서를 렌더링하지 못했습니다.</strong><p class="muted">로컬 파일을 직접 열면 브라우저가 Markdown 파일 읽기를 막을 수 있습니다. 로컬 서버로 index.html을 열거나 오른쪽 위 새 탭 열기를 사용하세요.</p></div>`;
    }
}

document.querySelectorAll(".docs-viewer").forEach((viewer) => {
    const docButtons = viewer.querySelectorAll("[data-doc-src]");

    docButtons.forEach((button) => {
        button.addEventListener("click", () => {
        const src = button.dataset.docSrc;
        const title = button.dataset.docTitle || button.textContent.trim();
        docButtons.forEach((item) => {
            const active = item === button;
            item.classList.toggle("active", active);
            item.setAttribute("aria-pressed", String(active));
        });
        loadMarkdownDoc(src, title, viewer);
        });
    });

    const initialDoc = viewer.querySelector("[data-doc-src].active") || docButtons[0];
    if (initialDoc) {
        loadMarkdownDoc(initialDoc.dataset.docSrc, initialDoc.dataset.docTitle || initialDoc.textContent.trim(), viewer);
    }
});

const pageButtons = document.querySelectorAll("[data-page-src]");
const pageFrame = document.querySelector("[data-page-frame]");
const pageTitle = document.querySelector("[data-page-current-title]");
const pageOpen = document.querySelector("[data-page-open]");

function loadPreviewPage(src, title) {
    if (pageTitle) pageTitle.textContent = title;
    if (pageOpen) pageOpen.href = src;
    if (pageFrame) pageFrame.src = src;
}

pageButtons.forEach((button) => {
    button.addEventListener("click", () => {
    const src = button.dataset.pageSrc;
    const title = button.dataset.pageTitle || button.textContent.trim();
    pageButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
    });
    loadPreviewPage(src, title);
    });
});

const initialPage = document.querySelector("[data-page-src].active") || pageButtons[0];
if (initialPage) {
    loadPreviewPage(initialPage.dataset.pageSrc, initialPage.dataset.pageTitle || initialPage.textContent.trim());
}

const memberToggleButtons = document.querySelectorAll("[data-member-toggle]");
const memberDetailRows = document.querySelectorAll("[data-member-detail]");
const memberRows = document.querySelectorAll("[data-member-row]");

function closeMemberEditors() {
    memberDetailRows.forEach((row) => { row.hidden = true; });
    memberRows.forEach((row) => row.classList.remove("is-open"));
    memberToggleButtons.forEach((button) => {
    button.setAttribute("aria-expanded", "false");
    button.textContent = "수정";
    });
}

memberToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
    const memberId = button.dataset.memberToggle;
    const detailRow = document.querySelector(`[data-member-detail="${memberId}"]`);
    const memberRow = document.querySelector(`[data-member-row="${memberId}"]`);
    const willOpen = detailRow?.hidden;
    closeMemberEditors();
    if (!detailRow || !willOpen) return;
    detailRow.hidden = false;
    memberRow?.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    button.textContent = "닫기";
    detailRow.querySelector("input, select, textarea")?.focus();
    });
});

document.querySelectorAll("[data-member-cancel]").forEach((button) => {
    button.addEventListener("click", closeMemberEditors);
});

document.querySelectorAll("[data-member-delete]").forEach((button) => {
    button.addEventListener("click", () => {
    showToast("삭제 버튼은 위험 액션 예시입니다. 실제 서비스에서는 확인 팝업을 연결합니다.", "warning");
    });
});

document.querySelectorAll("[data-member-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.querySelector("input")?.value.trim() || "회원";
    showToast(`${name} 회원 정보가 저장되었습니다.`, "success");
    });
});

document.querySelectorAll("[data-auth-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
    event.preventDefault();
    const type = form.dataset.authForm;
    showToast(type === "signup" ? "회원가입 신청 정보가 저장되었습니다." : "로그인 요청 예시입니다.", "success");
    });
});

document.querySelectorAll("[data-auth-focus]").forEach((button) => {
    button.addEventListener("click", () => {
    const target = document.querySelector("[data-signup-panel]");
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    target?.querySelector("input, select, textarea, button")?.focus();
    });
});

document
    .querySelectorAll(
    "#components .component-card .code-label, #boards .board-doc-card .code-label, #headers .header-doc-grid .code-label, #feedback .feedback-code-card .code-label"
    )
    .forEach((label) => {
    const codeBlock = label.nextElementSibling;
    if (!codeBlock || codeBlock.tagName !== "PRE") return;

    const panel = label.closest(".component-card, .board-doc-card, .feedback-code-card, .panel");
    const labelText = label.textContent.trim() || "코드";
    const toggle = document.createElement("button");
    toggle.className = "code-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = `${labelText} 보기`;

    codeBlock.hidden = true;
    panel?.classList.add("is-code-hidden");
    label.after(toggle);

    toggle.addEventListener("click", () => {
        const willOpen = codeBlock.hidden;
        codeBlock.hidden = !willOpen;
        toggle.setAttribute("aria-expanded", String(willOpen));
        toggle.textContent = `${labelText} ${willOpen ? "숨기기" : "보기"}`;
        panel?.classList.toggle("is-code-hidden", !willOpen);
        panel?.classList.toggle("is-code-open", willOpen);
    });
    });
