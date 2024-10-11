<?php
namespace mod_attendance\form;

class absencereport extends \moodleform {
    public function definition() {
        $mform  =& $this->_form;
        $sessid = $this->_customdata['sessid'];
        $studentid = $this->_customdata['studentid'];
        $mform->addElement('filepicker', 'userfile', get_string('file'), null, array('accepted_types' => '*', 'maxbytes' => $maxbytes));
        $mform->addRule('userfile', null, 'required', null, 'client');
        $mform->addElement('hidden', 'sessid', null);
        $mform->setType('sessid', PARAM_INT);
        $mform->setConstant('sessid', $sessid);
        $mform->addElement('hidden', 'studentid', null);
        $mform->setType('studentid', PARAM_INT);
        $mform->setConstant('studentid', $studentid);

        $this->add_action_buttons();
    }
}
