$(document).ready(function () {
    var table = $('#studentDataTable').DataTable({
        ajax: "http://192.168.3.51:1100/api/getAllUser",
        columns: [
            {
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: '',
            },
            {   
                "mData":null,
                "mRender":function(o) { 
                        return o.firstName+' '+o.lastName
                }
            },
            {   
                "mData":null,
                "mRender":function(o) { 
                        return new Date(o.dateOfBirth).toString().slice(0,16)
                }
            },
            { data: 'contactNumber'},
            { data: 'email' },
            { data: 'address' },
            {
                "mData": null,
                "bSortable": false,
                "mRender": function (o) {
                    return `<button class="btn btn-primary m-1" onclick="edit('${o._id}')">
                            <span><i class="fas fa-edit"></i></span>
                            </button><button class="btn btn-primary m-1" id="deleteBtn` + o._id + `" onclick="deleteRow(this)">
                            <span><i class="fa-solid fa-trash"></i></span></button>`;
                }
            }

        ],
        "pageLength": 10
    });

    //Extra columns
    $('#studentDataTable tbody').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });


    //Sumitting Data And Add Row
    $('#submitData').on('click', function () {
        //Post data In API
        let validationCheck = Validate()
        if (validationCheck) {
            fetch("http://192.168.3.51:1100/api/addUser", {
                method: "POST",
                body: JSON.stringify({
                    "firstName": validationCheck.fName,
                    "lastName": validationCheck.lName,
                    "dateOfBirth": validationCheck.DOB,
                    "contactNumber": validationCheck.contactNo,
                    "email": validationCheck.Email,
                    "address": validationCheck.Address,
                    "Education": validationCheck.education
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }); 
            table.row.add(
                {
                    "firstName": validationCheck.fName,
                    "lastName": validationCheck.lName,
                    "dateOfBirth": validationCheck.DOB,
                    "contactNumber": validationCheck.contactNo,
                    "email": validationCheck.Email,
                    "address": validationCheck.Address,
                    "Education": validationCheck.education
                }
            ).draw(false);

            $("#staticBackdrop").modal("hide");

            let f = document.getElementById("StudentForm")
            f.reset()
            $("#submitted").html(` <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Your Form is Submited!</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`)
            $("#alertValidation").html("")
        } else {
            $("#alertValidation").html(`<div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Please Feel The Form Correctly!</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`)
        }
    })

    $('#AddDetails').on('click', function () {
        //only required button will show and form is reset
        $('#submitData').show()
        $('#staticBackdropLabel').html('Add Details')
        $('#updateData').hide()
        document.getElementById("form").innerHTML = null
        counter = 2
        let f = document.getElementById("StudentForm")
        f.reset()
    })


    //reset everything when form is closed
    $('#close').on('click', function () {
        removeErr()
        let f = document.getElementById("StudentForm")
        f.reset()
        $("#alertValidation").html("")
    })

});


/* Formatting function for row details - modify as you need */
function format(d) {
    // `d` is the original data object for the row
    var ExtraTable = `
    <table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">
        <tr>
            <th>Education Details: </th>
            <th scope="col">Degree</th>
            <th scope="col">Institute</th>
            <th scope="col">Start Date</th>
            <th scope="col">Passout Year</th>
            <th scope="col">Percentage</th>
            <th scope="col">Backlog</th>
        </tr>
    `
    for (ele of d.Education) {
        newStDT=new Date(ele.startDate)
        newStDTMon=newStDT.toString().slice(4,7)
         
        //if there were no backlogs
        if(ele.backlogs==0){
            ele.backlogs='NA'
        }

        ExtraTable += `
        <tr>
            <td></td>
            <td>${ele.degree}</td>
            <td>${ele.instituteName}</td>
            <td>${newStDTMon} ${newStDT.getFullYear()}</td>
            <td>${ele.passoutYear}</td>
            <td>${ele.percentage}</td>
            <td>${ele.backlogs}</td>
        </tr>
        `
    }
    ExtraTable += `</table>`
    return ExtraTable
}

//Edit Row
let updateIndex, objWithIdIndex;  //set global to use below

function edit(btn) {
    //only required button will show and form is reset
    $('#updateData').show()
    $('#staticBackdropLabel').html('Edit Details')
    $("#staticBackdrop").modal("show");
    $('#submitData').hide()                 

    //GET the value in iput field using get user by ID API
    updateIndex = btn
    let p=fetch("http://192.168.3.51:1100/api/getUserById/"+updateIndex)
    p.then((val1)=>{      
        return val1.json()
    }).then((val2)=>{
        let studentDetail=val2.data[0];
       // passing values in input field
        fname = studentDetail.firstName
        lname = studentDetail.lastName

        DateOB = new Date(studentDetail.dateOfBirth)
        DateOBy = DateOB.getFullYear()
        DateOBm = (DateOB.getMonth() + 1).toString().padStart(2, 0)  //Months are started from 0 i.e. +1 used
        DateOBd = DateOB.getDate().toString().padStart(2, 0)
        emailId = studentDetail.email

        addressDetail = studentDetail.address

        contact = studentDetail.contactNumber

        edu = studentDetail.Education

        document.getElementById('fname').value = fname
        document.getElementById('lname').value = lname
        document.getElementById('dob').value = DateOBy+'-'+DateOBm+'-'+DateOBd
        document.getElementById('email').value = emailId
        document.getElementById('address').value = addressDetail
        document.getElementById('contactNo').value =contact

        document.getElementById("form").innerHTML = null
        counter = 2
        j = 0
        for (ele of edu) {
            if (j > 1) {
                Add()
            }
            StDate = new Date(ele.startDate)
            StDatey = StDate.getFullYear()
            StDatem = (StDate.getMonth() + 1).toString().padStart(2, 0)  //Months are started from 0 i.e. +1 used

            document.getElementById(`deg${j}`).value = ele.degree
            document.getElementById(`clg${j}`).value = ele.instituteName
            document.getElementById(`strDt${j}`).value = `${StDatey}-${StDatem}`
            document.getElementById(`psDt${j}`).value = `${ele.passoutYear}-06`
            document.getElementById(`per${j}`).value = ele.percentage
            document.getElementById(`bc${j}`).value = ele.backlogs
            j+=1
        }
    });
}

//Update Details
function updateDetail() {

    //PUT data of user using ID 
    let updateValidate = Validate()
    if (updateValidate) {
        fetch("http://192.168.3.51:1100/api/updateUser/"+updateIndex, {
                method: "PUT",
                body: JSON.stringify({
                    "firstName": updateValidate.fName,
                    "lastName": updateValidate.lName,
                    "dateOfBirth": updateValidate.DOB,
                    "contactNumber": updateValidate.contactNo,
                    "email": updateValidate.Email,
                    "address": updateValidate.Address,
                    "Education": updateValidate.education
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });

        $("#staticBackdrop").modal("hide");

        $("#submitted").html(` <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Your Form is Updated!</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`)
        $("#alertValidation").html("")
    } else {
        $("#alertValidation").html(`<div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Please Feel The Form Correctly!</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`)
    }

    setTimeout(() => {
        $('#studentDataTable').DataTable().ajax.reload()
    }, 200); 
    
}                                                                           

//Delete Row                
function deleteRow(btn) { //btn is this
    //DELETE the user details using ID

    let text = "Are You Sure To Delete This Data?";
    if (confirm(text) == true) {
        fetch('http://192.168.3.51:1100/api/deleteUserbyId/' + btn.id.slice(9), {
            method: 'DELETE',
        })
        setTimeout(() => {
            $('#studentDataTable').DataTable().ajax.reload()
        }, 200);   //set timeout because of reload wanna refresh for first row
    }
}



//Add Row
let counter = 2
function Add() {
    const add = document.createElement("div");   //  Div element is created
    add.classList = "row form"                  //  Div having class row and mt-2

    //Inner HTML of that div 

    add.innerHTML = `                              
        <div class="mb-3  col">
            <label for="formGroupExampleInput" class="form-label hide">Degree/Board</label>
            <input id="deg${counter}"  type="text" class="form-control degree" required>
            <div id="degErr${counter}"  class="text-danger m-1 error"></div>
        </div>
        <div class="mb-3 col">
            <label for="formGroupExampleInput" class="form-label hide">School/Colege</label>
            <input id="clg${counter}" type="text" class="form-control college" required>
             <div id="clgErr${counter}"  class="text-danger m-1 error"></div>
            </div>
        <div class="mb-3 col">
            <label for="formGroupExampleInput" class="form-label hide">Start Date</label>
            <input id="strDt${counter}" type="month" class="form-control startDt" required>
              <div id="strDtErr${counter}"  class="text-danger m-1 error"></div>
            </div>
        <div class="mb-3 col">
            <label for="formGroupExampleInput" class="form-label hide">Passout Year</label>
            <input id="psDt${counter}" type="month" class="form-control passYr" placeholder="mm/yyyy" required>
                <div id="psDtErr${counter}"  class="text-danger m-1 error"></div>
            </div>
        <div class="mb-3 col">
            <label for="formGroupExampleInput" class="form-label hide">Percentage</label>
            <input id="per${counter}" type="number" class="form-control percent" min="0" max="100" step="0.01" placeholder="Don't use % sign" required>
             <div id="perErr${counter}"  class="text-danger m-1 error"></div>
            </div>
        <div class="mb-3 col">
            <label for="formGroupExampleInput" class="form-label hide">Backlog</label>
            <input id="bc${counter}" type="number" class="form-control back" min="0" placeholder="If Any">
             <div id="bcErr${counter}"  class="text-danger m-1 error"></div>
            </div>
        <div class="mt-4 col text-center">
                <button type="button" class="delBtn border-0 rounded-circle bg-dark" onclick="Del(this)"> 
                        <i class="text-white fa-solid fa-minus"></i></button>
                 </div>
        <hr>
   `; //By clicking on - button Del function will be call and "this" is the attribute passed to the Del()

    document.getElementById("form").appendChild(add);    //New row will append in id "form"
    counter += 1
};

//Delete Row
function Del(ele) {                       // ele = this = element which clicked = button
    let del = ele.parentNode.parentNode   // parent of button is div and parent of that div is row-div
    del.remove();                        // row will be removed
}

//Validations
function Validate() {
    var details = {}
    first = $("#fname").val().trim()
    last = $("#lname").val().trim()
    birth = $("#dob").val();
    emailId = $("#email").val();
    addressDetail = $("#address").val().trim();
    contact = $("#contactNo").val().trim();
    //Name
    var nameCheck = /^[A-Za-z]+$/
    //Email
    var mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
 
    //Contact
    var contactRegex = /^[6-9]\d{9}$/

    //Validations for name
    //Not using if else ladder because of showing all error on one click
    validationCounter = true
    if (!nameCheck.test(first)) {
        document.getElementById("fnameErr").innerHTML = 'First Name is Invalid!'
        validationCounter = false
    } else {
        document.getElementById("fnameErr").innerHTML = ''
    }
    if (!nameCheck.test(last)) {
        document.getElementById("lnameErr").innerHTML = 'Last Name is Invalid!'
        validationCounter = false
    } else {
        document.getElementById("lnameErr").innerHTML = ''
    }
    if (birth == "") {    //Date of Birth
        document.getElementById("dobErr").innerHTML = 'Date Of Birth is Invalid!'
        validationCounter = false
    } else {
        document.getElementById("dobErr").innerHTML = ''
    }
    if (!mailformat.test(emailId)) {       //Validations for email
        document.getElementById("mailErr").innerHTML = "Invalid Mail Id"
        email.focus();
        validationCounter = false
    } else {
        document.getElementById("mailErr").innerHTML = ''
    }
    if (addressDetail == "") {       //Address
        document.getElementById("addressErr").innerHTML = 'Address is Invalid!'
        validationCounter = false
    } else {
        document.getElementById("addressErr").innerHTML = ''
    }
    if (!contactRegex.test(contact)) {    //Graduation Year
        document.getElementById("contactNoErr").innerHTML = 'Contact Number is Invalid!'
        validationCounter = false
    } else {
        document.getElementById("contactNoErr").innerHTML = ''
    }

    //creating arrays using class


    for (let i = 0; i < counter; i++) {

        var degree = document.getElementById(`deg${i}`)
        var college = document.getElementById(`clg${i}`)
        var startDt = document.getElementById(`strDt${i}`)
        var passYr = document.getElementById(`psDt${i}`)
        var percent = document.getElementById(`per${i}`)
        var back = document.getElementById(`bc${i}`)

        if (document.getElementById(`deg${i}`)) {
            if (degree.value == "") {
                document.getElementById(`degErr${i}`).innerHTML = "Degree can't be empty!"
                degree.focus()
                validationCounter = false
            } else {
                document.getElementById(`degErr${i}`).innerHTML = ""
            }

            if (college.value == "") {
                document.getElementById(`clgErr${i}`).innerHTML = "College Name can't be empty!"
                college.focus()
                validationCounter = false
            } else {
                document.getElementById(`clgErr${i}`).innerHTML = ""
            }

            if (startDt.value == "") {
                document.getElementById(`strDtErr${i}`).innerHTML = "Start Date can't be empty!"
                degree.focus()
                validationCounter = false
            } else {
                document.getElementById(`strDtErr${i}`).innerHTML = ""
            }

            if (passYr.value == "") {
                document.getElementById(`psDtErr${i}`).innerHTML = "PassOut Year can't be empty!"
                startDt.focus()
                validationCounter = false
            } else {
                document.getElementById(`psDtErr${i}`).innerHTML = ""
            }

            if (percent.value == "") {
                document.getElementById(`perErr${i}`).innerHTML = "Percent can't be empty!"
                percent.focus()
                validationCounter = false
            } else if (percent.value < 0) {
                document.getElementById(`perErr${i}`).innerHTML = "Percent can't be Negative!"
                percent.focus()
                validationCounter = false
            } else if (percent.value > 100) {
                document.getElementById(`perErr${i}`).innerHTML = "Percent can't be greater than 100!"
                percent.focus()
                validationCounter = false
            }
            else {
                document.getElementById(`perErr${i}`).innerHTML = ""
            }

            if (back.value == "") {
                document.getElementById(`bcErr${i}`).innerHTML = "Backlog can't be empty!"
                back.focus()
                validationCounter = false
            } else if (back.value < 0) {
                document.getElementById(`bcErr${i}`).innerHTML = "Backlog can't be Negative!"
                back.focus()
                validationCounter = false
            } else {
                document.getElementById(`bcErr${i}`).innerHTML = ""
            }

        }
    }
    if (validationCounter == true) {
        //slice is used for only print date not time
        DateOB = new Date(dob.value)
        DateOBy = DateOB.getFullYear()
        DateOBm = (DateOB.getMonth() + 1).toString().padStart(2, 0)  //Months are started from 0 i.e. +1 used
        DateOBd = (DateOB.getDate()).toString().padStart(2, 0)
        dobFormat=DateOBm+'-'+DateOBd+'-'+DateOBy

        details.fName = first
        details.lName=last
        details.DOB = dobFormat
        details.contactNo = contact
        details.Email = emailId
        details.Address = addressDetail

        Education = []

        for (let i = 0; i < counter; i++) {
            var degree = document.getElementById(`deg${i}`)
            var college = document.getElementById(`clg${i}`)
            var percent = document.getElementById(`per${i}`)
            var back = document.getElementById(`bc${i}`)


            if (degree) {
                var startDt = new Date(document.getElementById(`strDt${i}`).value);
                let stDtM=(startDt.getMonth()+1).toString().padStart(2, 0)
                let stDtY=startDt.getFullYear().toString()
                startDateFormat=stDtM+'-01-'+stDtY

                var passYr = new Date(document.getElementById(`psDt${i}`).value).getFullYear()
                let education = {
                    "degree": degree.value,
                    "instituteName": college.value,
                    "startDate": startDateFormat,
                    "passoutYear": passYr,
                    "percentage": percent.value,
                    "backlogs": back.value,
                }
                Education.push(education)  //adding object to array      
            }
        }
        details.education = Education
        return details
    }
}


//Removing errors on new form open for edit or add
function removeErr() {
    document.getElementById("fnameErr").innerHTML = ''
    document.getElementById("lnameErr").innerHTML = ''
    document.getElementById("dobErr").innerHTML = ''
    document.getElementById("mailErr").innerHTML = ''
    document.getElementById("addressErr").innerHTML = ''
    document.getElementById("contactNoErr").innerHTML = ''

    for (let i = 0; i < counter; i++) {
        if (document.getElementById(`deg${i}`)) {
            document.getElementById(`degErr${i}`).innerHTML = ""
            document.getElementById(`clgErr${i}`).innerHTML = ""
            document.getElementById(`strDtErr${i}`).innerHTML = ""
            document.getElementById(`psDtErr${i}`).innerHTML = ""
            document.getElementById(`perErr${i}`).innerHTML = ""
            document.getElementById(`bcErr${i}`).innerHTML = ""
        }
    }
}

