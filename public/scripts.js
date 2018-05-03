// document
//     .getElementById('confirm-button')
//     .addEventListener('click', function(e) {
//         e.preventDefault();
//         document.getElementById('web-form').submit();
//         console.log('thanks for your submission');
//     });

// document.getElementById('web-form').addEventListener('submit', function(e) {
//     e.preventDefault();
// });

const form = document.getElementById('webform');

form.addEventListener('submit', function(e) {
    //     e.preventDefault();

    let values = {};
    for (var i = 0; i < form.elements.length; i++) {
        var fieldName = form.elements[i].name;
        var fieldValue = form.elements[i].value;

        if (fieldName === 'tags') {
            const selected = document.querySelectorAll('#tags option:checked');
            values[fieldName] = [];
            //selected if a NodeList so we use 'for of' to iterate.
            for (let element of selected) {
                values[fieldName].push(element.value);
            }
        } else if (fieldName && fieldValue) {
            values[fieldName] = fieldValue;
        }
    }
    console.log('Form values:', JSON.stringify(values, null, 2));
});
