<?php

require_once(dirname(__FILE__).'/../../config.php');

$cmid = required_param('id', PARAM_INT);
$sessid = required_param('sessid', PARAM_INT);

$PAGE->set_url('/mod/attendance/locationinput.php', array('id' => $cmid, 'sessid' => $sessid));

require_login();
$context = context_module::instance($cmid);
require_capability('mod/attendance:canbelisted', $context);

$locations = array(
    'oncampus' => get_string('oncampus', 'mod_attendance'),
    'athome' => get_string('athome', 'mod_attendance')
);

echo $OUTPUT->header();
echo $OUTPUT->heading(get_string('inputlocation', 'attendance'));

$mform = new \moodleform();
$formdata = array();

$mform->addElement('hidden', 'id', $cmid);
$mform->setType('id', PARAM_INT);

$mform->addElement('hidden', 'sessid', $sessid);
$mform->setType('sessid', PARAM_INT);

$mform->addElement('select', 'location', get_string('location', 'mod_attendance'), $locations);
$mform->addHelpButton('location', 'location', 'mod_attendance');
$mform->addRule('location', get_string('required'), 'required', null, 'client');

$mform->addElement('submit', 'submitbutton', get_string('submit'));

$mform->display();

echo $OUTPUT->footer();
