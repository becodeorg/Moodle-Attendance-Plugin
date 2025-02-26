define([], function() {
    return {
        init: function() {
            const updateRow = document.querySelector('.bulkeditrow');
            const sessionStatuses = updateRow.querySelectorAll('[id*="radiocheckstatus"]');
            const remarkUpdateField = updateRow.querySelector('#update_remarks');
            const checkinUpdateField = updateRow.querySelector('#update_checkin_time');
            const locationsUpdateField = updateRow.querySelector('#update_locations');

            const formatTime = (sessionTime) => {
                const [day, monthName, year, time] = sessionTime.split(' ');
                const months = {
                    January: '01', February: '02', March: '03', April: '04',
                    May: '05', June: '06', July: '07', August: '08',
                    September: '09', October: '10', November: '11', December: '12'
                };
            
                const timeParts = time.match(/(\d{1,2})(?::(\d{2}))?(AM|PM)/);
                if (!timeParts) throw new Error('Invalid time format');
            
                let [_, hour, minutes, period] = timeParts;
                minutes = minutes || '00';
                hour = period === 'PM' && hour !== '12' ? +hour + 12 : (period === 'AM' && hour === '12' ? 0 : hour);
                hour = String(hour).padStart(2, '0');
            
                return `${day.padStart(2, '0')}-${months[monthName]}-${year} ${hour}:${minutes}`;
            };
            
            const setStatusToCheckedRows = (classname, index) => {
                const remarkUpdateField = updateRow.querySelector('#update_remarks');
                const checkinUpdateField = updateRow.querySelector('#update_checkin_time');

                const sessionTime = document.querySelector('.sessionTimeString').value;

                const checkedBoxes = document.querySelectorAll('input#cb_selector:checked');

                checkedBoxes.forEach(checkboxElement => {
                    const parentRow = checkboxElement.parentElement.parentElement;
                    const status = parentRow.querySelector('.' + classname);

                    if (index == 0) {
                        remarkUpdateField.value = "Coach: Updated as present"
                        remarkUpdateField.dispatchEvent(new Event('input'));

                        checkinUpdateField.value = formatTime(sessionTime);
                        checkinUpdateField.dispatchEvent(new Event('input'));
                    }
                    if (index == 1) {
                        remarkUpdateField.value = "Coach: Updated as Late"
                        remarkUpdateField.dispatchEvent(new Event('input'));

                        // no timestamp: late can be any time, 
                        // 15 minutes after start of session
                    }
                    if (index == 2) {
                        remarkUpdateField.value = "Coach: Updated as Excused";
                        remarkUpdateField.dispatchEvent(new Event('input'));

                        checkinUpdateField.value = "01-01-1970 01:00";
                        checkinUpdateField.dispatchEvent(new Event('input'));
                    }
                    if (index == 3) {
                        remarkUpdateField.value = "Coach: Updated as Absent"
                        remarkUpdateField.dispatchEvent(new Event('input'));

                        checkinUpdateField.value = "01-01-1970 01:00";
                        checkinUpdateField.dispatchEvent(new Event('input'));
                    }
                    
                    if (status) {
                        status.checked = true;
                    } else {
                        console.error("status element not found for", parentRow);
                    }
                })
            }

            const setValuesToCheckedRows = (content, targetSelector) => {
                const checkedBoxes = document.querySelectorAll('input#cb_selector:checked');

                checkedBoxes.forEach(checkboxElement => {
                    const parentRow = checkboxElement.parentElement.parentElement;
                    const targetElement = parentRow.querySelector(targetSelector);

                    if (targetElement) {
                        targetElement.value = content;
                    } else {
                        console.error("Target element not found in", parentRow);
                    }
                })
            }

            sessionStatuses.forEach((st, index) => {
                const classname = st.className;

                st.addEventListener('click', () => {
                    setStatusToCheckedRows(classname, index);
                })
            })

            remarkUpdateField.addEventListener('input', () => {
                setValuesToCheckedRows(remarkUpdateField.value, '[name*="remarks"]');
            })

            checkinUpdateField.addEventListener('input', () => {
                setValuesToCheckedRows(checkinUpdateField.value, '.checkin_time');
            })

            locationsUpdateField.addEventListener('input', () => {
                setValuesToCheckedRows(locationsUpdateField.value, '.location');
            })
        }
    };
});