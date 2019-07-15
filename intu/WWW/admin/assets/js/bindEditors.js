class Editors {
    constructor() {
        this.drawTable = this.drawTable.bind(this);
        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);
        this.intuAPI = new IntuAPI();
        this.table = null;
        this.activeRow = null;
    }
    drawTable() {
        // render editors table
        this.intuAPI.getEditorsList()
            .then(editors => {
                console.info("--editors:", editors)
                if (Array.isArray(editors)) {
                    this.table = new Tabulator("#editors-table", {
                        data: editors, // assign data to table
                        layout: "fitColumns", // fit columns to width of table
                        columns: [ // Define Table Columns
                            { title: "id", field: "id", visible: false },
                            { title: "Email", field: "email", align: "left" },
                            { title: "Name", field: "name", align: "left" }
                        ],
                        rowClick: (e, row) => { // fill the form fields
                            this.activeRow = row;
                            var row = row.getData();
                            window.rowUid = row.id;
                            $('input[name="name"]').val(row.name);
                            $('input[name="email"], input[name="password"]').val('');

                            $('html, body').animate({ // scroll to form
                                scrollTop: $("#editor-form").offset().top
                            }, 500);
                        },
                    });
                } else {
                    console.info('failed to get editors list');
                    window.location = '/admin'
                }

            })
            .then(this.initActionButtons);
    }

    // add & edit user
    save(id) {
        let password = $("#editor-form input[name='password']").val();
        let email = $("#editor-form input[name='email']").val();
        let name = $("#editor-form input[name='name']").val();
        if (id) { // edit user
            if (typeof id === 'undefined' || id === '' || name === '') {
                throw new Error("no user selected to edit");
            }

            return this.intuAPI.editEditor(id, name) //id of user is gonna be the same if edit, so we are updating only name
                .then((documentRef) => {
                    $('.notification').removeClass('d-hide').find('.text').text('user was successfully updated');
                    $('.grid-form input').val('');
                    setTimeout(function() {
                        $('.notification').addClass('d-hide').find('.text').text('');
                    }, 4000);
                    $('html, body').animate({ // scroll to form
                        scrollTop: $("#editor-form").offset().top
                    }, 500);
                    // table refresh
                    this.table
                        .updateOrAddData([{ id: id, name: name }])
                        .then(function() {
                            console.info('table updated');
                        })
                        .catch(function(error) {
                            console.info('unable update table', error);
                        });
                });
        } else { // add user

            if (email === '' || password === '') {
                $('.js-add-editor').removeAttr("disabled");
                $('.loader').removeClass('active');
                $('.notification').removeClass('d-hide').find('.text').text('User email and password can\'t be blank');
                setTimeout(function() {
                    $('.notification').addClass('d-hide').find('.text').text('');
                }, 2000);
                throw new Error("user data is empty");
            }

            return this.intuAPI.addEditor(name, email, password)
                .then((documentRef) => {
                    console.info("--documentRef:", documentRef)
                    $('.notification').removeClass('d-hide').find('.text').text('new user was created');
                    $('.grid-form input').val('');
                    setTimeout(function() {
                        $('.notification').addClass('d-hide').find('.text').text('');
                    }, 4000);
                    $('html, body').animate({ // scroll to form
                        scrollTop: $("#editor-form").offset().top
                    }, 500);
                    // table refresh
                    this.table
                        .updateOrAddData([{ id: documentRef.id, email: email, name: name }])
                        .then(function() {
                            console.info('table updated');
                        })
                        .catch(function(error) {
                            console.info('unable update table', error);
                        });
                })
                .catch(err => {
                    if (typeof err !== 'undefined') {
                        alert("Unable to create user: " + err.errorMessage);
                    }
                    console.info('err: ', err);
                    $('.notification').removeClass('d-hide').addClass('error-msg').find('.text').text('an error occured, user wasn\'t created', err);
                    setTimeout(function() {
                        $('.notification').addClass('d-hide').removeClass('error-msg').find('.text').text('');
                    }, 4000);
                });
        }
    }

    remove(id) {
        return this.intuAPI.deleteEditor(id)
            .then(() => {
                $('.notification').removeClass('d-hide').find('.text').text(' The user was successfully deleted');
                $('.grid-form input').val('');
                setTimeout(function() {
                    $('.notification').addClass('d-hide').find('.text').text('');
                }, 4000);
                $('html, body').animate({ // scroll to form
                    scrollTop: $("#editor-form").offset().top
                }, 500);
                // table refresh
                this.activeRow.delete()
                    .then(function() {
                        console.info('table updated');
                    })
                    .catch(function(error) {
                        console.info('unable update table', error);
                    });
            })
            .catch(function(e) {
                alert('Unable to delete user: ' + e);
            });
    }
}