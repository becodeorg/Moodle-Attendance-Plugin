const allCheckboxes = document.querySelectorAll('#cb_selector');
const sessionTime = document.querySelector('.sessionTimeString').value;
const sessionStatuses = document.querySelectorAll('.statusOption');
const sessionLocationSelector = document.querySelector('[name="setalllocations-select"]');

const checkAll = allCheckboxes[0];
console.log(sessionTime);

const formatTime = (sessTime) => {

    // Split the date string into its components
    const [day, monthName, year, time] = sessTime.split(' ');

    // Map month names to their corresponding numbers
    const months = {
        January: '01', February: '02', March: '03', April: '04',
        May: '05', June: '06', July: '07', August: '08',
        September: '09', October: '10', November: '11', December: '12'
    };

    // Extract hours and minutes from the time string and adjust for AM/PM
    const timeParts = time.match(/(\d{1,2}):(\d{2})(AM|PM)/);
    let [hour, minutes, period] = timeParts.slice(1);
    hour = period === 'PM' && hour !== '12' ? parseInt(hour) + 12 : hour;
    hour = period === 'AM' && hour === '12' ? '00' : String(hour).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');

    // Combine into the desired format
    return `${day.padStart(2, '0')}-${months[monthName]}-${year} ${hour}:${minutes}`;

}

checkAll.addEventListener('change', function() {
    const isChecked = this.checked;
    
    allCheckboxes.forEach((checkbox, index) => {
        if (index !== 0) { // Skip the first checkbox (checkAll)
            checkbox.checked = isChecked;
        }
    });
});

sessionStatuses.forEach(st => {
    st.addEventListener('click', () => {
        const tableRows = document.querySelector('.generaltable').querySelectorAll('tr');
        const sessionStatusSelector = document.querySelector('[name="setallstatus-select"]').value;
        const attendanceTakeForm = document.getElementById('attendancetakeform');
        const statusCode = st.classList[0].substring(2);
        

        switch (sessionStatusSelector) {
            case 'all' :
                const formattedTimestamp = formatTime(sessionTime);
                attendanceTakeForm.querySelectorAll(`.st${statusCode}`).forEach(sessionStatus => {
                    sessionStatus.checked = true;
                })

                attendanceTakeForm.querySelectorAll(`[name^="remarks"]`).forEach(field => {
                    field.value = "Admin update";
                });

                // Present
                if (statusCode == 5) {
                    attendanceTakeForm.querySelectorAll('[name^="checkin_time["]').forEach(field => {
                        field.value = formattedTimestamp;
                    });
                }

                // Late
                if (statusCode == 7) {
                    // ...
                }

                // Excused
                if (statusCode == 8){
                    // ...
                }

                // Absent
                if (statusCode == 6) {
                    attendanceTakeForm.querySelectorAll('[name^="checkin_time["]').forEach(field => {
                        field.value = "01-01-1970 01:00";
                    });
                }
                

                break;
            case 'selectedusers' :
                console.log(tableRows);
                tableRows.forEach(row => {
                    let checkbox = row.querySelector('#cb_selector');

                    if (checkbox) {  // Ensure the checkbox exists
                        if (checkbox.checked) {
                            let status = row.querySelector(`.st${statusCode}`);
                            const formattedTimestamp = formatTime(sessionTime);
                            const userId = status.name.replace('user','');

                            status.checked = true

                            let remarkField = row.querySelector(`[name="remarks${userId}"]`);
                            remarkField.value = "Admin update";

                            // Present
                            if (statusCode == 5) {
                                let checkinField = row.querySelector(`[name="checkin_time[${userId}]"]`);
                                checkinField.value = formattedTimestamp;
                            }

                            // Late
                            if (statusCode == 7) {
                                let checkinField = row.querySelector(`[name="checkin_time[${userId}]"]`);
                                checkinField.value = '';
                            }

                            // Excused
                            if (statusCode == 8){
                                let checkinField = row.querySelector(`[name="checkin_time[${userId}]"]`);
                                checkinField.value = '';
                            }

                            // Absent
                            if (statusCode == 6) {
                                let checkinField = row.querySelector(`[name="checkin_time[${userId}]"]`);
                                checkinField.value = "01-01-1970 01:00";
                            }

                            console.log(userId);
                        } else {
                            console.log('Checkbox in this row is not checked');
                        }
                    }

                })
                break;
        }

    })
})

// Update locations
sessionLocationSelector.addEventListener('change', () => {

    const sessionStatusSelector = document.querySelector('[name="setallstatus-select"]').value;
    console.log(sessionStatusSelector)

    if (sessionStatusSelector == "all") {
        document.querySelectorAll(`[name^="location["]`).forEach(location => {
            location.value = sessionLocationSelector.value
            console.log(location)
        });

    } else if (sessionStatusSelector === "selectedusers") {
        const tableRows = document.querySelector('.generaltable').querySelectorAll('tr');

        tableRows.forEach(row => {
            let checkbox = row.querySelector('#cb_selector');

            if (checkbox) {
                if (checkbox.checked) {
                    let userId = row.querySelector(`[name^="checked_users["]`)
                                    .name
                                    .replace('checked_users[', '')
                                    .replace(']','')

                    let locationField = row.querySelector(`[name="location[${userId}]"]`)
                    locationField.value = sessionLocationSelector.value
                }
            }
        })
    }
})