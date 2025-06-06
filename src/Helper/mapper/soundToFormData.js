let work ={
    soundToFormData: function (sound) {
        let formData = new FormData();
        formData.append('sound', sound);
        return formData;
    }
}

module.exports = work;