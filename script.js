// HPRC Dashboard Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    setupTooltips();
    setupTableSorting();
    setupInteractiveElements();
    setupProgressBars();
    setupResponsiveTables();
}

// Tooltip System for Help and Information
function setupTooltips() {
    const tooltipData = {
        'system-utilization': {
            title: 'System Utilization',
            text: 'Node and Core utilization shows the current usage of HPC resources. Allocated means actively used, Mixed means partially used, and Idle means available for new jobs.',
            link: 'https://hprc.tamu.edu/kb/system-utilization'
        },
        'queue-availability': {
            title: 'Queue Availability',
            text: 'Queue availability shows how many nodes and CPU cores are available in each job queue. Different queues have different resource limits and priorities.',
            link: 'https://hprc.tamu.edu/kb/queue-availability'
        },
        'group-memberships': {
            title: 'Group Memberships',
            text: 'Group memberships determine your access to shared resources and billing. Each group has different permissions and resource allocations.',
            link: 'https://hprc.tamu.edu/kb/group-memberships'
        },
        'accounts': {
            title: 'Service Unit Accounts',
            text: 'Service Units (SU) are the currency for HPC compute time. Each account tracks allocation, usage, and remaining balance. Used values are negative because they represent consumption.',
            link: 'https://hprc.tamu.edu/kb/service-units'
        },
        'disk-quotas': {
            title: 'Disk Quotas',
            text: 'Disk quotas show your storage usage and limits for different directories. File usage tracks the number of files, while disk usage tracks storage space.',
            link: 'https://hprc.tamu.edu/kb/disk-quotas'
        }
    };

    // Add help tooltips to card headers
    document.querySelectorAll('.card-header h2').forEach(header => {
        const helpIcon = document.createElement('button');
        helpIcon.className = 'help-icon';
        helpIcon.innerHTML = '<i class="fas fa-question-circle"></i>';
        helpIcon.title = 'Click for help';
        
        helpIcon.addEventListener('click', function(e) {
            e.preventDefault();
            const cardTitle = header.textContent.toLowerCase();
            let tooltipKey = '';
            
            if (cardTitle.includes('system utilization')) tooltipKey = 'system-utilization';
            else if (cardTitle.includes('queue availability')) tooltipKey = 'queue-availability';
            else if (cardTitle.includes('group memberships')) tooltipKey = 'group-memberships';
            else if (cardTitle.includes('accounts')) tooltipKey = 'accounts';
            else if (cardTitle.includes('disk quotas')) tooltipKey = 'disk-quotas';
            
            if (tooltipKey && tooltipData[tooltipKey]) {
                showTooltip(e, tooltipData[tooltipKey]);
            }
        });
        
        header.parentNode.appendChild(helpIcon);
    });
}

function showTooltip(event, content) {
    const tooltip = document.getElementById('tooltip');
    const title = document.getElementById('tooltipTitle');
    const text = document.getElementById('tooltipText');
    const link = document.getElementById('tooltipLink');
    
    title.textContent = content.title;
    text.textContent = content.text;
    link.href = content.link;
    
    tooltip.style.display = 'block';
    
    // Position tooltip
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.bottom + 10) + 'px';
    
    // Hide tooltip after 8 seconds
    setTimeout(() => {
        tooltip.style.display = 'none';
    }, 8000);
}

// Table Sorting Functionality
function setupTableSorting() {
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', function() {
            const table = this.closest('.accounts-table, .quotas-table, .queue-table');
            const columnIndex = Array.from(this.parentNode.children).indexOf(this);
            const rows = Array.from(table.querySelectorAll('.table-row'));
            
            // Toggle sort direction
            const isAscending = this.classList.contains('sort-asc');
            
            // Remove sort classes from all headers
            table.querySelectorAll('.sortable').forEach(h => {
                h.classList.remove('sort-asc', 'sort-desc');
            });
            
            // Add appropriate sort class
            this.classList.add(isAscending ? 'sort-desc' : 'sort-asc');
            
            // Sort rows
            rows.sort((a, b) => {
                const aValue = a.children[columnIndex].textContent.trim();
                const bValue = b.children[columnIndex].textContent.trim();
                
                // Handle numeric values
                const aNum = parseFloat(aValue.replace(/[,$]/g, ''));
                const bNum = parseFloat(bValue.replace(/[,$]/g, ''));
                
                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return isAscending ? bNum - aNum : aNum - bNum;
                }
                
                // Handle text values
                return isAscending ? 
                    bValue.localeCompare(aValue) : 
                    aValue.localeCompare(bValue);
            });
            
            // Reorder rows in DOM
            rows.forEach(row => table.appendChild(row));
        });
    });
}

// Interactive Elements
function setupInteractiveElements() {
    // Add click handlers for account rows
    document.querySelectorAll('.accounts-table .table-row').forEach(row => {
        row.addEventListener('click', function() {
            const accountId = this.querySelector('.account-id').textContent;
            showAccountDetails(accountId);
        });
    });
    
    // Add click handlers for quota rows
    document.querySelectorAll('.quotas-table .table-row').forEach(row => {
        row.addEventListener('click', function() {
            const diskName = this.querySelector('.disk-name').textContent;
            showQuotaDetails(diskName);
        });
    });
    
    // Add click handlers for group items
    document.querySelectorAll('.group-item').forEach(item => {
        item.addEventListener('click', function() {
            const groupName = this.textContent;
            showGroupDetails(groupName);
        });
    });
    
    // Add click handlers for quota increase buttons
    document.querySelectorAll('.btn-small').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('.table-row');
            const diskName = row.querySelector('.disk-name').textContent;
            requestQuotaIncrease(diskName);
        });
    });
}

function showAccountDetails(accountId) {
    const accountData = {
        '154669186753': {
            type: 'Research Account',
            pi: 'Dr. Sarah Johnson',
            allocation_period: '2024-2025',
            usage_breakdown: {
                'CPU Hours': '1,850',
                'GPU Hours': '473',
                'Memory Hours': '2,323'
            },
            last_activity: '2 hours ago'
        },
        '155062417651': {
            type: 'Default Account',
            pi: 'Dr. Sarah Johnson',
            allocation_period: '2024-2025',
            usage_breakdown: {
                'CPU Hours': '4,200',
                'GPU Hours': '2,215',
                'Memory Hours': '6,415'
            },
            last_activity: '1 day ago'
        },
        '156171559762': {
            type: 'New Research Account',
            pi: 'Dr. Sarah Johnson',
            allocation_period: '2024-2025',
            usage_breakdown: {
                'CPU Hours': '0',
                'GPU Hours': '0',
                'Memory Hours': '0'
            },
            last_activity: 'Never used'
        }
    };
    
    const account = accountData[accountId];
    if (account) {
        showModal(`Account Details: ${accountId}`, `
            <div class="account-details-modal">
                <div class="detail-row">
                    <span class="detail-label">Account Type:</span>
                    <span class="detail-value">${account.type}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Principal Investigator:</span>
                    <span class="detail-value">${account.pi}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Allocation Period:</span>
                    <span class="detail-value">${account.allocation_period}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Last Activity:</span>
                    <span class="detail-value">${account.last_activity}</span>
                </div>
                <div class="usage-breakdown">
                    <h4>Usage Breakdown:</h4>
                    ${Object.entries(account.usage_breakdown).map(([key, value]) => `
                        <div class="detail-row">
                            <span class="detail-label">${key}:</span>
                            <span class="detail-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `);
    }
}

function showQuotaDetails(diskName) {
    const quotaData = {
        'home': {
            path: '/home/username/',
            purpose: 'Personal files and configurations',
            backup: 'Daily backup',
            retention: 'Permanent',
            access: 'Personal access only'
        },
        'scratch': {
            path: '/scratch/username/',
            purpose: 'Temporary computation files',
            backup: 'No backup',
            retention: '30 days',
            access: 'Personal access only'
        },
        'group/p.sta220004.000': {
            path: '/work/p.sta220004.000/',
            purpose: 'Shared research data',
            backup: 'Weekly backup',
            retention: 'Project duration',
            access: 'Group members only'
        },
        'group/p.tra230003.000': {
            path: '/work/p.tra230003.000/',
            purpose: 'Shared research data',
            backup: 'Weekly backup',
            retention: 'Project duration',
            access: 'Group members only'
        }
    };
    
    const quota = quotaData[diskName];
    if (quota) {
        showModal(`Quota Details: ${diskName}`, `
            <div class="quota-details-modal">
                <div class="detail-row">
                    <span class="detail-label">Path:</span>
                    <span class="detail-value">${quota.path}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Purpose:</span>
                    <span class="detail-value">${quota.purpose}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Backup:</span>
                    <span class="detail-value">${quota.backup}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Retention:</span>
                    <span class="detail-value">${quota.retention}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Access:</span>
                    <span class="detail-value">${quota.access}</span>
                </div>
            </div>
        `);
    }
}

function showGroupDetails(groupName) {
    const groupData = {
        'u.mp108705': {
            type: 'User Group',
            description: 'Personal user group',
            members: 1,
            permissions: 'Full access to personal resources'
        },
        'staff': {
            type: 'Staff Group',
            description: 'HPRC staff access group',
            members: 25,
            permissions: 'Administrative access to HPRC systems'
        },
        'hprc': {
            type: 'General Group',
            description: 'General HPRC user group',
            members: 500,
            permissions: 'Access to general HPRC resources'
        },
        'matlab': {
            type: 'Software Group',
            description: 'MATLAB software license group',
            members: 200,
            permissions: 'Access to MATLAB software licenses'
        },
        'p.sta220004.000': {
            type: 'Project Group',
            description: 'Statistics research project group',
            members: 8,
            permissions: 'Access to project-specific resources and storage'
        },
        'p.tra230003.000': {
            type: 'Project Group',
            description: 'Transportation research project group',
            members: 12,
            permissions: 'Access to project-specific resources and storage'
        },
        'p.tra220029.000': {
            type: 'Project Group',
            description: 'Transportation research project group',
            members: 6,
            permissions: 'Access to project-specific resources and storage'
        }
    };
    
    const group = groupData[groupName];
    if (group) {
        showModal(`Group Details: ${groupName}`, `
            <div class="group-details-modal">
                <div class="detail-row">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${group.type}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Description:</span>
                    <span class="detail-value">${group.description}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Members:</span>
                    <span class="detail-value">${group.members}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Permissions:</span>
                    <span class="detail-value">${group.permissions}</span>
                </div>
            </div>
        `);
    }
}

function requestQuotaIncrease(diskName) {
    showModal(`Request Quota Increase: ${diskName}`, `
        <div class="quota-request-modal">
            <p>To request a quota increase for <strong>${diskName}</strong>, please:</p>
            <ol>
                <li>Justify the need for additional storage</li>
                <li>Specify the requested quota amount</li>
                <li>Provide project details and timeline</li>
                <li>Submit through the HPRC help ticket system</li>
            </ol>
            <div class="modal-actions">
                <button class="btn-primary" onclick="openHelpTicket('quota-increase', '${diskName}')">
                    Create Help Ticket
                </button>
                <button class="btn-secondary" onclick="closeModal()">
                    Cancel
                </button>
            </div>
        </div>
    `);
}

function openHelpTicket(type, context) {
    closeModal();
    showToast(`Opening help ticket for ${type} - ${context}`, 'info');
    // In a real implementation, this would open the help ticket system
}

// Progress Bar Animations
function setupProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    // Animate progress bars on load
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Responsive Table Handling
function setupResponsiveTables() {
    // Add data labels for mobile view
    const tables = document.querySelectorAll('.accounts-table, .quotas-table, .queue-table');
    
    tables.forEach(table => {
        const headers = table.querySelectorAll('.table-header .table-cell');
        const rows = table.querySelectorAll('.table-row');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('.table-cell');
            cells.forEach((cell, index) => {
                if (headers[index]) {
                    cell.setAttribute('data-label', headers[index].textContent.trim());
                }
            });
        });
    });
}

// Modal System
function showModal(title, content) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modalTitle"></h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body" id="modalBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .modal {
                display: none;
                position: fixed;
                z-index: 2000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            }
            
            .modal-content {
                background-color: white;
                margin: 5% auto;
                padding: 0;
                border-radius: 12px;
                width: 90%;
                max-width: 600px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                animation: modalSlideIn 0.3s ease-out;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #e5e5e5;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #333;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s;
            }
            
            .modal-close:hover {
                background: #f0f0f0;
            }
            
            .modal-body {
                padding: 1.5rem;
            }
            
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .detail-row:last-child {
                border-bottom: none;
            }
            
            .detail-label {
                font-weight: 500;
                color: #666;
            }
            
            .detail-value {
                font-weight: 600;
                color: #333;
            }
            
            .usage-breakdown {
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid #e5e5e5;
            }
            
            .usage-breakdown h4 {
                margin-bottom: 0.5rem;
                color: #333;
            }
            
            .modal-actions {
                display: flex;
                gap: 1rem;
                margin-top: 1.5rem;
                justify-content: flex-end;
            }
            
            .btn-primary {
                background: #8B0000;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .btn-primary:hover {
                background: #6B0000;
            }
            
            .btn-secondary {
                background: #f8f9fa;
                color: #333;
                border: 1px solid #e5e5e5;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .btn-secondary:hover {
                background: #e9ecef;
            }
            
            .help-icon {
                background: none;
                border: none;
                color: #8B0000;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: background-color 0.2s;
                margin-left: 0.5rem;
            }
            
            .help-icon:hover {
                background: rgba(139, 0, 0, 0.1);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Populate modal
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    
    // Show modal
    modal.style.display = 'block';
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Toast Notification System
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add toast styles if not already added
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 3000;
                animation: toastSlideIn 0.3s ease-out;
                box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
            }
            
            .toast-success {
                background: #28a745;
            }
            
            .toast-error {
                background: #dc3545;
            }
            
            .toast-warning {
                background: #f59e0b;
            }
            
            .toast-info {
                background: #8B0000;
            }
            
            @keyframes toastSlideIn {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes toastSlideOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease-in';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // H to show help
    if (e.key === 'h' || e.key === 'H') {
        showToast('Press H for help, ESC to close modals', 'info');
    }
});

// Export functions for global access
window.closeModal = closeModal;
window.openHelpTicket = openHelpTicket;