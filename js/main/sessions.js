const allCheckboxes = document.querySelectorAll('#cb_selector');
const checkAll = allCheckboxes[0];

checkAll.addEventListener('change', function() {
    const isChecked = this.checked;
    
    allCheckboxes.forEach((checkbox, index) => {
        if (index !== 0) { // Skip the first checkbox (checkAll)
            checkbox.checked = isChecked;
        }
    });
});