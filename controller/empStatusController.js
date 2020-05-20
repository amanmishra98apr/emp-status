var tblhrmemployeedetails = require("../models/tbl_hrm_employee_details")
var moment = require("moment")
var tblhrmlogs = require("../models/tbl_hrm_logs")
const sequalize = require("../common/dbconfig").sequelize;
const Sequalize = require("sequelize");
const { Op } = require("sequelize");
tblhrmemployeedetails = tblhrmemployeedetails(sequalize, Sequalize)
tblhrmlogs = tblhrmlogs(sequalize, Sequalize)

// Find data from multiple tables
exports.userStatus = (req, res, next) => {
  var modified_id = req.body.a_uid
  var value = req.body.value
  var id = req.body.emp_id
  var dol = req.body.date_of_leaving
  var updateArr = {}
  updateArr['status'] = value
  console.log(updateArr)
  var d = new Date();
  d.setTime(1432851021000);
  var newdate = moment(d);
  console.log(newdate.format("YYYY-MM-DD HH:mm:ss "));
  updateArr['modified_time'] = newdate.format("YYYY-MM-DD HH:mm:ss ")
  updateArr['modified_auid'] = modified_id
  console.log("how r u")
  var ed = tblhrmemployeedetails.findAll({
    offset: (req.body.page_no - 1) * 20, limit: 20,
    where: {
      id: id
    }
  })
  ed.then(l_users => {
    console.log(updateArr);
    date = new Date(dol)
    if ((value == '5' || value == '6') && dol != "") {
      date_of_leaving = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      //date_of_leaving = "2019-11-07T11:05:50.000Z"
      updateArr['date_of_leaving'] = date_of_leaving
      console.log(updateArr)
    }
    if (l_users[0]['status'] == '5' || l_users[0]['status'] == '6') {
      updateArr['date_of_leaving'] = "1970-01-01";
    }
    if (l_users[0]['status'] == '3' && value == '2' && l_users[0]['date_of_permanent'] == '0000-00-00') {
      console.log("value isddd 5")
      if (new Date(l_users[0]['date_of_joining']).getTime() > date.getTime()) {
        responseArr = { success: '0', message: 'Select Valid Date' }
        res.json(responseArr)
        //die();
      } else {
        updateArr['date_of_permanent'] = date.getTime();
        //$res = $this->_emp->updateRow($updateArr, array("id" => $encryptid));
        resp = updateStatus(id, updateArr)
        //$this->_report->calculatelevaes($encryptid, 1);
      }
    }
    else {
      responseArr = { success: '1', message: 'Employee Status Changed' }
      //console.log(responseArr)
      resp = updateStatus(id, updateArr)
    }
    console.log(responseArr)
    res.json(responseArr)
    /*tblhrmlogs.create({
    hrm_id: id,
    action: "Change Status",
    details:{
      id: id,
      value: value
    },
    response: res,
    updated_auid: a_uid,
    updated_hrmid: '0'
  }).then(result =>{
    res.json(result)
  })*/
  })
}
function updateStatus(id, list) {
  console.log(id, list)
  tblhrmemployeedetails.update(list, {
    where: {
      id: id
    }
  }).then(result => {
    console.log("done")
  })
}

/*exports.userStatus = (req, res, next) => {
  tblhrmemployeedetails.create({
    id: 277,
    employee_firstname: 'joy',
    employee_middlename: 'k',
    employee_lastname: 'roy'
  }).then(result =>{
    res.json(result)
  })

}

exports.userStatus = (req, res, next) => {
  tblhrmemployeedetails.findAll({

  }).then(result =>{
    res.json(result)
  })

}*/
/*
var id=277
list= {employee_firstname: 'narayana', employee_middlename: "kumar", employee_lastname :"Dixit"}
x = updateStatus(id,list)*/



//const jane = await User.create({ firstName: "Jane", lastName: "Doe" });
//console.log("Jane's auto-generated ID:", jane.id);
// Change everyone without a last name to "Doe"
/*await User.update({ lastName: "Doe" }, {
  where: {
    lastName: null
  }
});*/

