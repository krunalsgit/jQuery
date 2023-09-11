$(document).ready(function () {
    var table = $('#studentDataTable').DataTable({
        ajax: '/studentData.json',
        columns: [
            {
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: '',
            },
            { data: 'id' },
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
                            </button><button class="btn btn-primary m-1" id="deleteBtn` + o.id + `" onclick="deleteRow(${o.id})">
                            <span><i class="fa-solid fa-trash"></i></span></button>`;
                }
            }
        ],
        "pageLength": 15
    });

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

    DataCounter=9  //Having 8 static elements

    $('#submitData').on('click',function(){
        let validationCheck = Validate()
        if (validationCheck){
           console.log(validationCheck);
            table.row.add(
                {
                    "id": validationCheck.id,
                    "name": validationCheck.Name,
                    "dob": validationCheck.DOB,
                    "email": validationCheck.Email,
                    "address": validationCheck.Address,
                    "graduationYear": validationCheck.GraduationYear,
                    "education":validationCheck.education
                } 
            ).draw(false);

            counter+=1

            $("#staticBackdrop").modal("hide");

            let f= document.getElementById("StudentForm")
            f.reset()

            $("#alertValidation").html(` <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Your Form is Submited!</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`)
        } else {
            $("#alertValidation").html(`<div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Please Feel The Form Correctly!</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`)
        }
    })
});


/* Formatting function for row details - modify as you need */
function format(d) {
    // `d` is the original data object for the row
    var ExtraTable=`
    <table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">
        <tr>
            <th>Education Details: </th>
            <th scope="col">Sr. No.</th>
            <th scope="col">Degree</th>
            <th scope="col">College</th>
            <th scope="col">Start Date</th>
            <th scope="col">Passout Year</th>
            <th scope="col">Percentage</th>
            <th scope="col">Backlog</th>
        </tr>
    `
    for(ele of d.education){
        ExtraTable+=`
        <tr>
            <td></td>
            <td>${ele.educationId}</td>
            <td>${ele.degree}</td>
            <td>${ele.college}</td>
            <td>${ele.startDate}</td>
            <td>${ele.passOutYear}</td>
            <td>${ele.percentage}</td>
            <td>${ele.backlog}</td>
        </tr>
        `
    }
    return ExtraTable
}


//edit to show id
function edit(t){
    alert(t)
}

//delete
function deleteRow(t){
    alert(t)
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
    var details={}

    first=$("#fname").val().trim()
    last=$("#lname").val().trim()
    birth=$("#dob").val();
    emailId =$("#email").val();
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
            }else if (percent.value < 0) {
                document.getElementById(`perErr${i}`).innerHTML="Percent can't be Negative!"
                percent.focus()
                validationCounter = false
            }else if (percent.value > 100) {
                document.getElementById(`perErr${i}`).innerHTML="Percent can't be greater than 100!"
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
            }else if (back.value < 0) {
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
        db = new Date(dob.value).toUTCString().slice(0,16);  //utc format
        //console.clear()
        details.id = DataCounter
        details.Name = first+" "+last
        details.DOB = db
        details.Email = emailId
        details.Address = addressDetail
        details.GraduationYear = grYr

        Education = []

        for (let i = 0; i < counter; i++) {
            var degree = document.getElementById(`deg${i}`)
            var college = document.getElementById(`clg${i}`)
            var startDt = document.getElementById(`strDt${i}`)
            var passYr = document.getElementById(`psDt${i}`)
            var percent = document.getElementById(`per${i}`)
            var back = document.getElementById(`bc${i}`)

            if(degree){
                let education = {
                    "educationId":i+1,
                    "degree": degree.value,
                    "college": college.value,
                    "startDate": startDt.value,
                    "passOutYear": passYr.value,
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