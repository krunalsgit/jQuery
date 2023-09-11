
$(document).ready(function () {
    var table = $('#studentDataTable').DataTable({
        ajax: '/studentData.txt',  //reading data from json
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'dob' },
            { data: 'email' },
            { data: 'address' },
            { data: 'year' },
        ],
        "pageLength": 10
    });


//Extra Work for add row while submitting details

    counter=7  //Having 6 static elements

    $('#submitData').on('click',function(){

        first=$("#fname").val().trim()
        last=$("#lname").val().trim()
        birth=$("#dob").val();
        emailId =$("#email").val();
        addressDetail = $("#address").val().trim();
        grYr = new Date($("#graduationYear").val()).getFullYear();

        let validationCheck = Validate(first,last,birth,emailId,addressDetail,grYr)

        if (validationCheck==true){
            db = new Date(birth).toUTCString().slice(0,16);
            table.row.add(
                {
                    "id": counter,
                    "name": first + " " + last,
                    "dob": db,
                    "email": emailId,
                    "address": addressDetail,
                    "year": grYr
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

function Validate() {
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

    return validationCounter
}
