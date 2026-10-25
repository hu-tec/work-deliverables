(() => {
const denseFilter = document.querySelector("[data-dense-filter]");
const activeFilters = document.querySelector("[data-active-filters]");
const drawer = document.querySelector("[data-drawer-form]")?.closest(".member-drawer");
const drawerBackdrop = document.querySelector("[data-drawer-backdrop]");
const drawerForm = document.querySelector("[data-drawer-form]");
const memberWorkspace = document.querySelector("[data-member-workspace]");
const drawerOpenButtons = document.querySelectorAll("[data-drawer-open]");
const memberRows = document.querySelectorAll("[data-member-row]");
let lastDrawerTrigger = null;

if (drawer && memberWorkspace) {
    memberWorkspace.append(drawer);
}

const members = {
    "m-10024": {
        id: "M-10024",
        name: "김하윤",
        role: "일반회원",
        phone: "010-2410-8821",
        email: "hayun.kim@example.com",
        status: "활성",
        grade: "Gold",
        owner: "박민수",
        lastAction: "오늘 11:20 결제 완료",
        workflow: "번역 시험 접수",
        exam: "AITe 번역 전문가 전문1급",
        service: "비즈니스 문서 번역",
        payment: "결제 완료",
        tags: ["번역", "전문1급", "Gold", "이메일 인증", "알림 동의", "재응시 가능"],
        attributes: {
            "회원유형": "일반회원",
            "권한": "읽기/접수",
            "가입경로": "홈페이지",
            "이메일 인증": "완료",
            "휴대폰 인증": "완료",
            "마케팅 수신": "이메일/알림톡",
            "관심분야": "비즈니스 문서",
            "응시횟수": "3회",
            "최근 결제": "2026.06.02",
            "담당부서": "시험운영",
            "위험등급": "낮음",
            "관리메모": "다음 접수 알림 요청"
        },
        timelineA: "시험 접수 결제 완료",
        timelineB: "이메일 인증 완료",
        timelineC: "관리자 메모 업데이트",
        timelineD: "결제 영수증 발급",
        timelineE: "휴대폰 인증 완료",
        timelineF: "접수 안내 발송",
        memo: "번역 시험 문의. 다음 접수 오픈 시 알림 요청."
    },
    "m-10031": {
        id: "M-10031",
        name: "이준서",
        role: "강사",
        phone: "010-5138-7742",
        email: "junseo.lee@example.com",
        status: "활성",
        grade: "Silver",
        owner: "정유진",
        lastAction: "오늘 10:48 권한 변경",
        workflow: "강사 배정 검토",
        exam: "AI 윤리 교육 강사 과정",
        service: "출강 일정 관리",
        payment: "정산 확인 필요",
        tags: ["강사", "Silver", "출강", "승인 대기", "주말 가능", "관리자 확인"],
        attributes: {
            "회원유형": "강사",
            "권한": "읽기/작성/강사",
            "가입경로": "관리자등록",
            "이메일 인증": "완료",
            "휴대폰 인증": "완료",
            "마케팅 수신": "SMS",
            "전문분야": "AI 윤리 교육",
            "출강가능": "주말",
            "정산계좌": "확인 필요",
            "최근 강의": "2026.05.18",
            "담당부서": "교육운영",
            "위험등급": "보통"
        },
        timelineA: "강사 권한 변경 요청",
        timelineB: "출강 가능 일정 등록",
        timelineC: "담당자 배정 완료",
        timelineD: "정산 정보 확인",
        timelineE: "계약 상태 검토",
        timelineF: "알림톡 발송",
        memo: "출강 일정 조율중. 6월 주말 강의 가능 여부 확인 필요."
    },
    "m-10047": {
        id: "M-10047",
        name: "박서연",
        role: "일반회원",
        phone: "010-9044-1108",
        email: "seoyeon.park@example.com",
        status: "휴면",
        grade: "Basic",
        owner: "오지훈",
        lastAction: "어제 18:05 재인증 안내",
        workflow: "휴면 회원 재활성화",
        exam: "AI 번역 입문 과정",
        service: "회원 재인증",
        payment: "결제 이력 없음",
        tags: ["휴면", "Basic", "재인증", "미접속", "메일 발송", "알림 확인 필요"],
        attributes: {
            "회원유형": "일반회원",
            "권한": "읽기",
            "가입경로": "캠페인",
            "이메일 인증": "완료",
            "휴대폰 인증": "미완료",
            "마케팅 수신": "이메일",
            "휴면여부": "휴면",
            "미접속기간": "180일 이상",
            "최근 결제": "없음",
            "재인증": "필요",
            "담당부서": "회원운영",
            "위험등급": "주의"
        },
        timelineA: "휴면 재인증 메일 발송",
        timelineB: "최근 로그인 기간 초과",
        timelineC: "마케팅 수신 동의 확인",
        timelineD: "휴대폰 인증 미완료",
        timelineE: "복구 안내 발송",
        timelineF: "관리자 확인 대기",
        memo: "재인증 안내 필요. 이메일 수신 동의 상태 확인."
    }
};

function showToast(message, type = "success") {
    const viewport = document.querySelector("[data-toast-viewport]");
    if (!viewport) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="toast-dot"></i><span>${message}</span>`;
    viewport.prepend(toast);
    window.setTimeout(() => toast.remove(), 2600);
}

function renderActiveFilters() {
    if (!denseFilter || !activeFilters) return;

    const pressed = [...denseFilter.querySelectorAll('.filter-chip[aria-pressed="true"]')]
        .map((chip) => chip.textContent.trim())
        .filter((label) => label !== "전체");
    const checked = [...denseFilter.querySelectorAll(".dense-check input:checked")]
        .map((input) => input.closest(".dense-check")?.textContent.trim())
        .filter(Boolean);
    const labels = [...pressed, ...checked];

    if (!labels.length) {
        activeFilters.innerHTML = "";
        return;
    }

    activeFilters.innerHTML = labels
        .map((label) => `<span class="filter-tag">${label} <button type="button" data-filter-remove="${label}" aria-label="${label} 필터 제거">×</button></span>`)
        .join("") + '<button class="filter-clear" type="button" data-filter-clear>필터 전체 해제</button>';
}

if (denseFilter) {
    denseFilter.addEventListener("click", (event) => {
        const chip = event.target.closest(".filter-chip");
        const removeButton = event.target.closest("[data-filter-remove]");
        const clearButton = event.target.closest("[data-filter-clear]");

        if (chip) {
            const group = chip.closest("[data-filter-group]");
            const isSingleChoice = group?.hasAttribute("data-single-choice") || chip.textContent.trim() === "전체";

            if (isSingleChoice && group) {
                group.querySelectorAll(".filter-chip").forEach((item) => {
                    item.setAttribute("aria-pressed", String(item === chip));
                });
            } else {
                const next = chip.getAttribute("aria-pressed") !== "true";
                chip.setAttribute("aria-pressed", String(next));
                const allChip = group?.querySelector(".filter-chip");
                if (allChip?.textContent.trim() === "전체" && chip !== allChip) {
                    allChip.setAttribute("aria-pressed", "false");
                }
            }
            renderActiveFilters();
        }

        if (removeButton) {
            const label = removeButton.dataset.filterRemove;
            denseFilter.querySelectorAll(".filter-chip").forEach((item) => {
                if (item.textContent.trim() === label) item.setAttribute("aria-pressed", "false");
            });
            denseFilter.querySelectorAll(".dense-check").forEach((item) => {
                if (item.textContent.trim() === label) item.querySelector("input").checked = false;
            });
            renderActiveFilters();
        }

        if (clearButton) {
            denseFilter.querySelectorAll(".filter-chip").forEach((item) => {
                item.setAttribute("aria-pressed", String(item.textContent.trim() === "전체"));
            });
            denseFilter.querySelectorAll(".dense-check input").forEach((input) => {
                input.checked = false;
            });
            renderActiveFilters();
        }
    });

    denseFilter.addEventListener("change", renderActiveFilters);
    denseFilter.addEventListener("submit", (event) => {
        event.preventDefault();
        showToast("검색 조건을 적용했습니다.", "info");
    });
    denseFilter.addEventListener("reset", () => {
        window.setTimeout(renderActiveFilters, 0);
    });
    renderActiveFilters();
}

function setDrawerExpanded(memberId, expanded) {
    drawerOpenButtons.forEach((button) => {
        const active = expanded && button.dataset.drawerOpen === memberId;
        button.setAttribute("aria-expanded", String(active));
        button.textContent = active ? "닫기" : "상세";
    });
    memberRows.forEach((row) => {
        row.classList.toggle("is-open", expanded && row.dataset.memberRow === memberId);
    });
}

function fillDrawer(member) {
    drawer.querySelector("[data-drawer-title]").textContent = `${member.name} 회원 상세`;
    drawer.querySelector("[data-drawer-summary]").textContent = `${member.role} · ${member.email}`;
    drawer.querySelector('[data-field="id"]').textContent = member.id;
    drawer.querySelector('[data-field="status"]').textContent = member.status;
    drawer.querySelector('[data-field="grade"]').textContent = member.grade;
    drawer.querySelector('[data-field="owner"]').textContent = member.owner;
    drawer.querySelector('[data-field="lastAction"]').textContent = member.lastAction;
    drawer.querySelector('[data-field="workflow"]').textContent = member.workflow;
    drawer.querySelector('[data-field="exam"]').textContent = member.exam;
    drawer.querySelector('[data-field="service"]').textContent = member.service;
    drawer.querySelector('[data-field="payment"]').textContent = member.payment;
    drawer.querySelector('[data-field="timelineA"]').textContent = member.timelineA;
    drawer.querySelector('[data-field="timelineB"]').textContent = member.timelineB;
    drawer.querySelector('[data-field="timelineC"]').textContent = member.timelineC;
    drawer.querySelector('[data-field="timelineD"]').textContent = member.timelineD;
    drawer.querySelector('[data-field="timelineE"]').textContent = member.timelineE;
    drawer.querySelector('[data-field="timelineF"]').textContent = member.timelineF;
    drawer.querySelector('[data-field="tags"]').innerHTML = member.tags
        .map((tag) => `<span class="filter-tag">${tag}</span>`)
        .join("");
    drawer.querySelector('[data-field="sparseName"]').textContent = member.name;
    drawer.querySelector('[data-field="sparsePhone"]').textContent = member.phone;
    drawer.querySelector('[data-field="attributes"]').innerHTML = Object.entries(member.attributes)
        .map(([label, value]) => `<div><dt>${label}</dt><dd title="${value}">${value}</dd></div>`)
        .join("");

    Object.entries(member).forEach(([key, value]) => {
        const field = drawerForm.elements[key];
        if (field) field.value = value;
    });
}

function openDrawer(memberId, trigger) {
    const member = members[memberId];
    if (!member || !drawer) return;

    lastDrawerTrigger = trigger;
    fillDrawer(member);
    drawer.hidden = false;
    if (drawerBackdrop) drawerBackdrop.hidden = true;
    memberWorkspace?.classList.add("is-drawer-open");
    setDrawerExpanded(memberId, true);
    drawer.querySelector("[data-drawer-close]")?.focus();
}

function closeDrawer() {
    if (!drawer) return;

    drawer.hidden = true;
    if (drawerBackdrop) drawerBackdrop.hidden = true;
    memberWorkspace?.classList.remove("is-drawer-open");
    setDrawerExpanded("", false);
    lastDrawerTrigger?.focus();
    lastDrawerTrigger = null;
}

drawerOpenButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const memberId = button.dataset.drawerOpen;
        const alreadyOpen = button.getAttribute("aria-expanded") === "true";
        if (alreadyOpen) {
            closeDrawer();
            return;
        }
        openDrawer(memberId, button);
    });
});

document.querySelectorAll("[data-drawer-close]").forEach((button) => {
    button.addEventListener("click", closeDrawer);
});

drawerBackdrop?.addEventListener("click", closeDrawer);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer && !drawer.hidden) closeDrawer();
});

document.querySelector("[data-drawer-delete]")?.addEventListener("click", () => {
    showToast("삭제는 위험 액션입니다. 실제 서비스에서는 확인 팝업을 연결합니다.", "warning");
});

drawerForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = drawerForm.elements.name.value.trim() || "회원";
    showToast(`${name} 회원 정보가 저장되었습니다.`, "success");
});
})();
