document.addEventListener('DOMContentLoaded', () => {
    const DEFAULT_DATA = [
        {
            id: 'PRO10001',
            name: 'Madan Gopal',
            email: 'madan@example.com',
            phone: '73981 60132',
            plan: '3 Months',
            status: 'active',
            joinDate: '2024-01-12',
            expiryDate: '2026-01-12',
            fee: 4500,
            lastRechargeFee: 4500,
            notes: 'Focus on strength training and cardio balance.'
        },
        {
            id: 'PRO10002',
            name: 'Aisha Sharma',
            email: 'aisha@example.com',
            phone: '98111 22233',
            plan: '6 Months',
            status: 'expiring',
            joinDate: '2025-05-09',
            expiryDate: '2025-11-09',
            fee: 7200,
            lastRechargeFee: 7200,
            notes: 'Pending annual renewal confirmation.'
        },
        {
            id: 'PRO10003',
            name: 'Rahul Verma',
            email: 'rahul@example.com',
            phone: '90000 01122',
            plan: '1 Month',
            status: 'active',
            joinDate: '2026-06-15',
            expiryDate: '2026-07-15',
            fee: 1800,
            lastRechargeFee: 1800,
            notes: 'Prefers morning workout schedule.'
        },
        {
            id: 'PRO10004',
            name: 'Sneha Singh',
            email: 'sneha@example.com',
            phone: '88000 33774',
            plan: '12 Months',
            status: 'expired',
            joinDate: '2024-02-10',
            expiryDate: '2025-02-10',
            fee: 12000,
            notes: 'Needs reactivation after membership review.'
        },
        {
            id: 'PRO10005',
            name: 'Karan Patel',
            email: 'karan@example.com',
            phone: '70707 22334',
            plan: '3 Months',
            status: 'active',
            joinDate: '2026-07-01',
            expiryDate: '2026-10-01',
            fee: 4500,
            notes: 'Attending HIIT and yoga sessions.'
        },
        {
            id: 'PRO10004',
            name: 'Sneha Singh',
            email: 'sneha@example.com',
            phone: '88000 33774',
            plan: '12 Months',
            status: 'expired',
            joinDate: '2024-02-10',
            expiryDate: '2025-02-10',
            fee: 12000,
            notes: 'Needs reactivation after membership review.'
        },
        {
            id: 'PRO10005',
            name: 'Karan Patel',
            email: 'karan@example.com',
            phone: '70707 22334',
            plan: '3 Months',
            status: 'active',
            joinDate: '2026-07-01',
            expiryDate: '2026-10-01',
            fee: 4500,
            notes: 'Attending HIIT and yoga sessions.'
        },
        {
            id: 'PRO10004',
            name: 'Sneha Singh',
            email: 'sneha@example.com',
            phone: '88000 33774',
            plan: '12 Months',
            status: 'expired',
            joinDate: '2024-02-10',
            expiryDate: '2025-02-10',
            fee: 12000,
            notes: 'Needs reactivation after membership review.'
        },
        {
            id: 'PRO10005',
            name: 'Karan Patel',
            email: 'karan@example.com',
            phone: '70707 22334',
            plan: '3 Months',
            status: 'active',
            joinDate: '2026-07-01',
            expiryDate: '2026-10-01',
            fee: 4500,
            notes: 'Attending HIIT and yoga sessions.'
        }
    ];

    const memberTableBody = document.getElementById('memberTableBody');
    const memberSearch = document.getElementById('memberSearch');
    const statusFilter = document.getElementById('statusFilter');
    const planFilter = document.getElementById('planFilter');
    const totalMembers = document.getElementById('totalMembers');
    const activeMembers = document.getElementById('activeMembers');
    const expiringSoon = document.getElementById('expiringSoon');
    const monthlyRevenue = document.getElementById('monthlyRevenue');
    const tableCount = document.getElementById('tableCount');
    const addMemberForm = document.getElementById('addMemberForm');
    const editMemberForm = document.getElementById('editMemberForm');
    const rechargeMemberForm = document.getElementById('rechargeMemberForm');
    const formTitle = document.getElementById('formTitle');
    const cancelAdd = document.getElementById('cancelAdd');
    const cancelEdit = document.getElementById('cancelEdit');
    const cancelRecharge = document.getElementById('cancelRecharge');
    const adminThemeToggle = document.getElementById('adminThemeToggle');
    const resetDemoData = document.getElementById('resetDemoData');

    let members = JSON.parse(JSON.stringify(DEFAULT_DATA));
    let editingId = null;
    let rechargingId = null;

    function formatCurrency(value) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value || 0);
    }

    function formatDate(dateString) {
        if (!dateString) return '—';
        const date = new Date(`${dateString}T00:00:00`);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    function daysUntil(dateString) {
        if (!dateString) return Infinity;
        const today = new Date();
        const target = new Date(`${dateString}T00:00:00`);
        const difference = target - today;
        return Math.ceil(difference / (1000 * 60 * 60 * 24));
    }

    function updateMemberStatuses() {
        members.forEach((member) => {
            const remainingDays = daysUntil(member.expiryDate);
            
            if (remainingDays < 0) {
                // Membership has expired
                member.status = 'expired';
            } else if (remainingDays <= 7 && member.status !== 'expired') {
                // Membership expiring in 7 days or less
                member.status = 'expiring';
            }
            // Keep 'active' status for members with more than 7 days remaining
        });
    }

    function getFilteredMembers() {
        const search = memberSearch.value.trim().toLowerCase();
        const statusValue = statusFilter.value;
        const planValue = planFilter.value;

        return members.filter((member) => {
            const searchMatch = !search || [member.name, member.id, member.phone].some((field) =>
                String(field).toLowerCase().includes(search)
            );
            const statusMatch = statusValue === 'all' || member.status === statusValue;
            const planMatch = planValue === 'all' || member.plan === planValue;
            return searchMatch && statusMatch && planMatch;
        });
    }

    function renderStats() {
        // Update member statuses before rendering stats
        updateMemberStatuses();
        
        const activeCount = members.filter((member) => member.status === 'active').length;
        const expiringCount = members.filter((member) => member.status === 'expiring').length;
        const revenue = members.reduce((sum, member) => sum + Number(member.fee || 0), 0);

        totalMembers.textContent = String(members.length);
        activeMembers.textContent = String(activeCount);
        expiringSoon.textContent = String(expiringCount);
        monthlyRevenue.textContent = formatCurrency(revenue);
    }

    function statusBadge(status) {
        return `<span class="status-badge ${status}">${status}</span>`;
    }

    function renderTable() {
        const filteredMembers = getFilteredMembers();

        tableCount.textContent = `${filteredMembers.length} record${filteredMembers.length === 1 ? '' : 's'}`;

        if (!filteredMembers.length) {
            memberTableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-state">No members match the current filters.</td>
                </tr>
            `;
            return;
        }

        memberTableBody.innerHTML = filteredMembers
            .map((member) => `
                <tr>
                    <td>
                        <div class="member-name">
                            <strong>${member.name}</strong>
                            <small>${member.email}</small>
                        </div>
                    </td>
                    <td>${member.id}</td>
                    <td>${member.plan}</td>
                    <td>${formatDate(member.expiryDate)}</td>
                    <td>${statusBadge(member.status)}</td>
                    <td class="contact-cell">${member.phone}</td>
                    <td class="amount">${formatCurrency(member.lastRechargeFee || member.fee)}</td>
                    <td>
                        <div class="action-group">
                            <button class="action-btn" type="button" data-action="edit" data-id="${member.id}">Update</button>
                            <button class="action-btn" type="button" data-action="pay" data-id="${member.id}">Recharge</button>
                        </div>
                    </td>
                </tr>
            `)
            .join('');
    }

    function resetForm() {
        addMemberForm.reset();
        editMemberForm.reset();
        rechargeMemberForm.reset();
        editingId = null;
        rechargingId = null;
        formTitle.textContent = 'Add Member';
        addMemberForm.hidden = false;
        editMemberForm.hidden = true;
        rechargeMemberForm.hidden = true;
        cancelAdd.hidden = true;
        cancelEdit.hidden = true;
        cancelRecharge.hidden = true;
    }

    function populateEditForm(member) {
        editMemberForm.elements.name.value = member.name || '';
        editMemberForm.elements.email.value = member.email || '';
        editMemberForm.elements.phone.value = member.phone || '';
        editMemberForm.elements.plan.value = member.plan || '3 Months';
        editMemberForm.elements.status.value = member.status || 'active';
        editMemberForm.elements.joinDate.value = member.joinDate || '';
        editMemberForm.elements.fee.value = member.fee || 0;
        editMemberForm.elements.notes.value = member.notes || '';
    }

    function handleAddSubmit(event) {
        event.preventDefault();

        const formData = new FormData(addMemberForm);
        const cleanedMember = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            phone: formData.get('phone').trim(),
            plan: formData.get('plan'),
            status: 'active',
            joinDate: formData.get('joinDate'),
            expiryDate: calculateExpiryDate(formData.get('joinDate'), formData.get('plan')),
            fee: Number(formData.get('fee') || 0),
            notes: (formData.get('notes') || '').trim()
        };

        if (!cleanedMember.name || !cleanedMember.email || !cleanedMember.phone) {
            return;
        }

        const highestId = members.reduce((max, member) => {
            const numeric = Number(String(member.id).replace(/\D/g, '')) || 0;
            return Math.max(max, numeric);
        }, 10000);

        members.unshift({
            id: `PRO${String(highestId + 1).padStart(5, '0')}`,
            ...cleanedMember,
            lastRechargeFee: cleanedMember.fee
        });

        renderStats();
        renderTable();
        resetForm();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleEditSubmit(event) {
        event.preventDefault();

        const formData = new FormData(editMemberForm);
        const cleanedMember = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            phone: formData.get('phone').trim(),
            plan: formData.get('plan'),
            status: formData.get('status'),
            joinDate: formData.get('joinDate'),
            expiryDate: calculateExpiryDate(formData.get('joinDate'), formData.get('plan')),
            fee: Number(formData.get('fee') || 0),
            notes: (formData.get('notes') || '').trim()
        };

        if (!cleanedMember.name || !cleanedMember.email || !cleanedMember.phone) {
            return;
        }

        if (editingId) {
            members = members.map((member) =>
                member.id === editingId
                    ? { ...member, ...cleanedMember }
                    : member
            );
        }

        renderStats();
        renderTable();
        resetForm();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function calculateExpiryDate(joinDate, plan) {
        if (!joinDate) return '';
        const date = new Date(`${joinDate}T00:00:00`);
        const monthsMatch = plan.match(/\d+/);
        const months = monthsMatch ? parseInt(monthsMatch[0]) : 0;
        date.setMonth(date.getMonth() + months);
        return date.toISOString().split('T')[0];
    }

    function handleTableAction(event) {
        const button = event.target.closest('button[data-action]');
        if (!button) return;

        const memberId = button.dataset.id;
        const action = button.dataset.action;

        if (action === 'edit') {
            const member = members.find((item) => item.id === memberId);
            if (!member) return;

            editingId = member.id;
            formTitle.textContent = 'Edit Member';
            addMemberForm.hidden = true;
            editMemberForm.hidden = false;
            rechargeMemberForm.hidden = true;
            cancelEdit.hidden = false;
            cancelRecharge.hidden = true;
            populateEditForm(member);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (action === 'pay') {
            const member = members.find((item) => item.id === memberId);
            if (!member) return;

            rechargingId = member.id;
            formTitle.textContent = 'Recharge Member';
            addMemberForm.hidden = true;
            editMemberForm.hidden = true;
            rechargeMemberForm.hidden = false;
            cancelEdit.hidden = true;
            cancelRecharge.hidden = false;
            populateRechargeForm(member);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function populateRechargeForm(member) {
        document.getElementById('rechargeMemberId').value = member.id;
        document.getElementById('rechargeMemberName').value = member.name;
        document.getElementById('rechargeMemberStatus').value = member.status;
        document.getElementById('rechargeCurrentExpiry').value = formatDate(member.expiryDate);
        document.getElementById('rechargeMonths').value = '';
        document.getElementById('rechargeAdditionalFee').value = '';
        document.getElementById('rechargeNewExpiry').value = '';
    }

    function calculateRechargeExpiry(currentExpiryDate, monthsToAdd) {
        if (!currentExpiryDate || !monthsToAdd) return '';
        const date = new Date(`${currentExpiryDate}T00:00:00`);
        date.setMonth(date.getMonth() + parseInt(monthsToAdd));
        return formatDate(date.toISOString().split('T')[0]);
    }

    function handleRechargeSubmit(event) {
        event.preventDefault();

        if (!rechargingId) return;

        const months = document.getElementById('rechargeMonths').value;
        const additionalFee = Number(document.getElementById('rechargeAdditionalFee').value || 0);

        if (!months) {
            alert('Please select the number of months to add');
            return;
        }

        const member = members.find((m) => m.id === rechargingId);
        if (!member) return;

        // For expiring or expired members, calculate expiry from today (recharge date)
        // For active members, calculate from current expiry date
        let baseDate;
        const today = new Date();
        const currentExpiry = new Date(`${member.expiryDate}T00:00:00`);
        
        if (member.status === 'active' && currentExpiry > today) {
            // Active member with future expiry - extend from current expiry
            baseDate = new Date(`${member.expiryDate}T00:00:00`);
        } else {
            // Expiring or expired member - calculate from today
            baseDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        }
        
        baseDate.setMonth(baseDate.getMonth() + parseInt(months));
        const newExpiryDate = baseDate.toISOString().split('T')[0];

        // Update member - sync as active member after recharge
        member.expiryDate = newExpiryDate;
        member.fee = (member.fee || 0) + additionalFee;
        member.lastRechargeFee = additionalFee; // Track latest recharge fee
        member.status = 'active'; // Sync to active status after recharge
        member.lastRechargeDate = new Date().toISOString().split('T')[0]; // Track recharge date

        renderStats();
        renderTable();
        resetForm();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function applyTheme(isDark) {
        document.body.classList.toggle('theme-dark', isDark);
        adminThemeToggle.classList.toggle('is-dark', isDark);
        localStorage.setItem('proFitnessAdminTheme', isDark ? 'dark' : 'light');
    }

    function initTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('proFitnessAdminTheme');
        applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);
    }

    memberSearch.addEventListener('input', renderTable);
    statusFilter.addEventListener('change', renderTable);
    planFilter.addEventListener('change', renderTable);
    addMemberForm.addEventListener('submit', handleAddSubmit);
    editMemberForm.addEventListener('submit', handleEditSubmit);
    rechargeMemberForm.addEventListener('submit', handleRechargeSubmit);
    memberTableBody.addEventListener('click', handleTableAction);
    cancelAdd.addEventListener('click', resetForm);
    cancelEdit.addEventListener('click', resetForm);
    cancelRecharge.addEventListener('click', resetForm);
    
    // Update new expiry date when months selection changes
    document.getElementById('rechargeMonths').addEventListener('change', (event) => {
        const months = event.target.value;
        const currentExpiryInput = document.getElementById('rechargeCurrentExpiry').value;
        if (months && currentExpiryInput) {
            // Parse the formatted date back to YYYY-MM-DD
            const currentDate = new Date();
            const member = members.find((m) => m.id === rechargingId);
            if (member) {
                const newExpiry = calculateRechargeExpiry(member.expiryDate, months);
                document.getElementById('rechargeNewExpiry').value = newExpiry;
            }
        }
    });
    adminThemeToggle.addEventListener('click', () => {
        const nextDark = !document.body.classList.contains('theme-dark');
        applyTheme(nextDark);
    });
    resetDemoData.addEventListener('click', () => {
        members = JSON.parse(JSON.stringify(DEFAULT_DATA));
        renderStats();
        renderTable();
        resetForm();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    cancelEdit.hidden = true;
    initTheme();
    renderStats();
    renderTable();
});
