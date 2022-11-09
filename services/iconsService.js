import Icons from '../models/Icons.js';

class iconsService {
    async getIcons() {
        const icons = await Icons.find();

        return icons;
    }
}

export default new iconsService();