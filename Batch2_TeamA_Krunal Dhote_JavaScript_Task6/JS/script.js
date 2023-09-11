var jsonDataArr = []
$(document).ready(function () {
    var table = $('#studentDataTable').DataTable({
        data: jsonDataArr,
        columns: [
            {
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: '',
            },
            { data: 'name' },
            { data: 'dob' },
            { data: 'email' },
            { data: 'address' },
            { data: 'graduationYear' },
            {
                "mData": null,
                "bSortable": false,
                "mRender": function (o) {
                    return `<button class="btn btn-primary m-1" id="editBtn` + o.id + `" onclick="edit(${o.id})">
                            <span><i class="fas fa-edit"></i></span>
                            </button><button class="btn btn-primary m-1" id="deleteBtn` + o.id + `" onclick="deleteRow(${o.id},this)">
                            <span><i class="fa-solid fa-trash"></i></span></button>`;
                }
            }

        ],
        "pageLength": 15
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

    DataCounter = 9  //Having 8 static elements

    //Sumitting Data And Add Row
    $('#submitData').on('click', function () {
        let validationCheck = Validate()
        if (validationCheck) {
            table.row.add(
                {
                    "id": validationCheck.id,
                    "name": validationCheck.Name,
                    "dob": validationCheck.DOB,
                    "email": validationCheck.Email,
                    "address": validationCheck.Address,
                    "graduationYear": validationCheck.GraduationYear,
                    "education": validationCheck.education
                }
            ).draw(false);
            DataCounter += 1  //incrementing ID
            jsonDataArr.push(
                {
                    "id": validationCheck.id,
                    "name": validationCheck.Name,
                    "dob": validationCheck.DOB,
                    "email": validationCheck.Email,
                    "address": validationCheck.Address,
                    "graduationYear": validationCheck.GraduationYear,
                    "education": validationCheck.education
                }
            )

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


//Edit Row
let updateIndex,objWithIdIndex;  //set global to use below
function edit(i) {
    updateIndex=i
    objWithIdIndex = jsonDataArr.findIndex((obj) => obj.id == i);
    if (objWithIdIndex > -1) {

        //only required button will show and form is reset
        $('#updateData').show()
        $('#staticBackdropLabel').html('Edit Details')
        $("#staticBackdrop").modal("show");
    
        //passing values in input field
        fulllname = jsonDataArr[objWithIdIndex].name.split(" ")
        fname = fulllname[0]
        lname = fulllname[1]
    
        DateOB = new Date(jsonDataArr[objWithIdIndex].dob)
        DateOBy = DateOB.getFullYear()
        DateOBm = (DateOB.getMonth() + 1).toString().padStart(2, 0)  //Months are started from 0 i.e. +1 used
        DateOBd = DateOB.getDate().toString().padStart(2, 0)
    
        emailId = jsonDataArr[objWithIdIndex].email
    
        addressDetail = jsonDataArr[objWithIdIndex].address
    
        grYr = jsonDataArr[objWithIdIndex].graduationYear
    
        edu = jsonDataArr[objWithIdIndex].education
    
        document.getElementById('fname').value = fname
        document.getElementById('lname').value = lname
        document.getElementById('dob').value = `${DateOBy}-${DateOBm}-${DateOBd}`
        document.getElementById('email').value = emailId
        document.getElementById('address').value = addressDetail
        document.getElementById('graduationYear').value = grYr + '-06'
    
        document.getElementById("form").innerHTML = null
        counter = 2
        for (ele of edu) {
            if (ele.educationId > 2) {
                Add()
            }
            j = ele.educationId - 1

            StDate = new Date(ele.startDate)
            StDatey = StDate.getFullYear()
            StDatem = (StDate.getMonth() + 1).toString().padStart(2, 0)  //Months are started from 0 i.e. +1 used
    
            document.getElementById(`deg${j}`).value = ele.degree
            document.getElementById(`clg${j}`).value = ele.college
            document.getElementById(`strDt${j}`).value = `${StDatey}-${StDatem}`
            document.getElementById(`psDt${j}`).value = `${ele.passOutYear}-06`
            document.getElementById(`per${j}`).value = ele.percentage
            document.getElementById(`bc${j}`).value = ele.backlog
    
        }
        $('#submitData').hide()
    }   
}

//Update Details
function updateDetail(){
    let updateValidate = Validate()
        let updatedData = {}
        if (updateValidate) {
            updatedData = {
                "id": updateIndex,
                "name": updateValidate.Name,
                "dob": updateValidate.DOB,
                "email": updateValidate.Email,
                "address": updateValidate.Address,
                "graduationYear": updateValidate.GraduationYear,
                "education": updateValidate.education
            }
            jsonDataArr[objWithIdIndex] = updatedData
            $("#staticBackdrop").modal("hide");

            $("#submitted").html(` <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Your Form is Updated!</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`)
          $("#alertValidation").html("")
        }else {
            $("#alertValidation").html(`<div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Please Feel The Form Correctly!</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`)
        }

    //console.log($('#studentDataTable').DataTable().ajax.reload);
       $('#studentDataTable').DataTable().clear().rows.add(jsonDataArr).draw(); 
       console.log(jsonDataArr);
}

//Delete Row
function deleteRow(i,t){ //i is id and t is this getting onclick
    let text = "Are You Sure To Delete This Data?";
    if (confirm(text) == true) {
        objWithIdIndex = jsonDataArr.findIndex((obj) => obj.id == i);
        if (objWithIdIndex > -1) {
            jsonDataArr.splice(objWithIdIndex, 1);
        }
        $('#studentDataTable').DataTable().row( $(t).parents('tr') ).remove().draw();
    }
}


/* Formatting function for row details - modify as you need */
function format(d) {
    // `d` is the original data object for the row
    var ExtraTable = `
    <table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">
        <tr>
            <th>Education Details: </th>
            <th scope="col">Degree</th>
            <th scope="col">College</th>
            <th scope="col">Start Date</th>
            <th scope="col">Passout Year</th>
            <th scope="col">Percentage</th>
            <th scope="col">Backlog</th>
        </tr>
    `
    for (ele of d.education) {
        ExtraTable += `
        <tr>
            <td></td>
            <td>${ele.degree}</td>
            <td>${ele.college}</td>
            <td>${ele.startDate}</td>
            <td>${ele.passOutYear}</td>
            <td>${ele.percentage}</td>
            <td>${ele.backlog}</td>
        </tr>
        `
    }
    ExtraTable += `</table>`
    return ExtraTable
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
    grYr = new Date($("#graduationYear").val()).getFullYear();
    //Name
    var nameCheck = /^[A-Za-z]+$/
    //Email
    var mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

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
    if (graduationYear.value == "") {    //Graduation Year
        document.getElementById("grYrErr").innerHTML = 'Graduation year is Invalid!'
        validationCounter = false
    } else {
        document.getElementById("grYrErr").innerHTML = ''
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
        db = new Date(dob.value).toUTCString().slice(0, 16);  //utc format
        details.id = DataCounter
        details.Name = first + " " + last
        details.DOB = db
        details.Email = emailId
        details.Address = addressDetail
        details.GraduationYear = grYr

        Education = []

        for (let i = 0; i < counter; i++) {
            var degree = document.getElementById(`deg${i}`)
            var college = document.getElementById(`clg${i}`)
            var percent = document.getElementById(`per${i}`)
            var back = document.getElementById(`bc${i}`)

            if (degree) {
                var startDt = new Date(document.getElementById(`strDt${i}`).value)
                var passYr = new Date(document.getElementById(`psDt${i}`).value).getFullYear()
                let education = {
                    "educationId": i + 1,
                    "degree": degree.value,
                    "college": college.value,
                    "startDate": startDt,
                    "passOutYear": passYr,
                    "percentage": percent.value,
                    "backlog": back.value,
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
    document.getElementById("grYrErr").innerHTML = ''

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
