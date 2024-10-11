<?php
require_once(dirname(__FILE__).'/../../config.php');
require_once(dirname(__FILE__).'/locallib.php');
require_once($CFG->libdir.'/formslib.php');
require_once(dirname(__FILE__).'/absence_report_form.php');

// Check that the required parameters are present.
$sessid = required_param('sessid', PARAM_INT); // PARAM_INT for integers
$studentid = required_param('studentid', PARAM_INT);
$action = optional_param('action', '', PARAM_ALPHA); 
$attforsession = $DB->get_record('attendance_sessions', array('id' => $sessid), '*', MUST_EXIST);
$attconfig = get_config('attendance');
$attendance = $DB->get_record('attendance', array('id' => $attforsession->attendanceid), '*', MUST_EXIST);
$cm = get_coursemodule_from_instance('attendance', $attendance->id, $attforsession->course, false, MUST_EXIST);
$course = $DB->get_record('course', array('id' => $cm->course), '*', MUST_EXIST);


// Require the user is logged in.
require_login($course, true, $cm);
$context = context_module::instance($cm->id);
#require_capability('mod/attendance:manage', $context);

$action = optional_param('action', '', PARAM_ALPHA);

$PAGE->set_title($course->shortname. ": ".$att->name);
$PAGE->set_heading($course->fullname);
$PAGE->set_cacheable(true);
#$PAGE->navbar->add($att->name);

$output = $PAGE->get_renderer('mod_attendance');
echo $output->header();

$mform = new \mod_attendance\form\absencereport(null, array('sessid' => $sessid, 'studentid' => $studentid));
if ($data = $mform->get_data()) {
    $fileinfo = $mform->get_new_filename('userfile');
    #$content = $mform->get_file_content('userfile');
    $fileName = $fileinfo;
    $fileExt = pathinfo($fileName, PATHINFO_EXTENSION);
    // Generate a unique identifier
    $uniqueID = uniqid() . time();
    
    // Create a safe file name
    $safeFileName = preg_replace('/[^a-zA-Z0-9-_\.]/', '', basename($fileName, '.' . $fileExt)) . '_' . $uniqueID . '.' . $fileExt;

    // Define the upload directory and check if it exists
    $uploadBaseDir = $CFG->dataroot . '/mod_attendance_uploads/';
    if (!file_exists($uploadBaseDir) && !mkdir($uploadBaseDir, 0777, true) && !is_dir($uploadBaseDir)) {
        throw new \RuntimeException(sprintf('Directory "%s" was not created', $uploadBaseDir));
    }

    $itemid = time();
    // Define the full path for the new file
    $targetFilePath = $uploadBaseDir . $safeFileName;
    $result = $mform->save_file('userfile', $targetFilePath, 1);
    $file = $mform->save_stored_file('userfile', $context->id, 'mod_attendance', 'attendance', $itemid, dirname($targetFilePath) . "/" , basename($targetFilePath), 1);
    // Move the file to the desired directory
    if ($result) {
        // Prepare the record for the database
        $record = new stdClass();
        $record->sessionid = $sessid;
        $record->studentid = $studentid;
        $record->filepath = $targetFilePath;
        $record->approved = 0; // Assuming 0 for 'not approved'
        $now = time();
        $existingattendance = $DB->get_record('attendance_log', array('sessionid' => $sessid, 'studentid' => $studentid));
        if($existingattendance){
            $existingattendance->filepath = $targetFilePath;
            $existingattendance->itemid = $itemid;
            $existingattendance->approved = 0; 
            $DB->update_record('attendance_log', $existingattendance);
            $sessioninfo = $DB->get_record('attendance_sessions', array('id' => $sessid));
            $statusset = $sessioninfo->statusset;
            $sessioninfo->lasttaken = $now;
            $sessioninfo->lasttakenby = $USER->id;
            $DB->update_record('attendance_sessions', $sessioninfo);
        } else {
            $data = (object)$data;
            $data->sessionid = $sessid;
            $data->studentid = $studentid;
            $data->remarks = "Uploaded justification not yet approved";
            $data->filepath = $targetFilePath;
            $data->itemid = $itemid;
            $data->approved = 0;
            $DB->insert_record('attendance_log', $data);
            $sessioninfo = $DB->get_record('attendance_sessions', array('id' => $sessid));
            $statusset = $sessioninfo->statusset;
            $sessioninfo->lasttaken = $now;
            $sessioninfo->lasttakenby = $USER->id;
            $DB->update_record('attendance_sessions', $sessioninfo);
        }
       

        // Redirect
        $redirecturl = new moodle_url('/mod/attendance/view.php', ['id' => $cm->id]);
        redirect($redirecturl, "Absence justification sent for approval!", null);
    }
} else {
    $mform->display();
}
echo $output->footer();