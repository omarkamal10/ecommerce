$(function (){
    if ($('textarea#ta').length) {
        CKEDITOR.replace('ta')
    }

    $('a.confirmDeletion').on('click' , (event) => {
        if(!confirm('Confirm Deletion'))
            return false
    })
}) 