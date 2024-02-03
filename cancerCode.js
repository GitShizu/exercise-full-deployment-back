// Albums:

albumSchema.pre('save', async function (next) {
    if (this.isModified('musician')) {
        const Album = this.constructor;
        const albumId = this._id.toString()
        const oldAlbum = await Album.findById(albumId);
        const oldMusicianId = oldAlbum?.musician?.toString();
        if (oldMusicianId) {
            const oldMusician = await Musician.findById(oldMusicianId);
            if (oldMusician) {
                await oldMusician.removeAlbum(albumId)
                console.log('Pre save');
            }
        }
    }
    next();
})

albumSchema.post('save', async function (doc, next) {
    const album = doc;
    const musicianId = album.musician?.toString();
    if (musicianId) {
        const musician = await Musician.findById(musicianId);
        if (musician) {
            await musician.addAlbum(album._id.toString())
            console.log('Post save');
        }
    }
    next()
})

albumSchema.pre('remove', async function (next) {

    const musicianId = this.musician?.toString();
    if (musicianId) {
        const musician = await Musician.findById(musicianId);
        if (musician) {
            const albumId = this._id.toString();
            await musician.removeAlbum(albumId);
            console.log('Pre-remove');
        }
    }
    next()
})