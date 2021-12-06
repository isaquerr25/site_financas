const User = require('../models/User');
const Grids = require('../models/Grids');

module.exports = {
async index(req, res) {
    try {
        const { user_id } = req.params;
        const user = await User.findByPk(user_id, {
            include: { association: 'grid_values' }
            });
        console.log(user)
        return res.json(user.grid_values);
    } catch (error) {
        console.log(error)
    }
    
},

async store(req, res) {
    const { user_id } = req.params;
    const { name, date_inform, create_at } = req.body;
    const user = await User.findByPk(user_id);
    if (!user) {
    return res.status(400).json({ error: 'User not found' });
    }
    try{
        const _grids = await Grids.create({
        name,
        date_inform,
        create_at,
        user_id,
        });
        return res.json(_grids);
    }
    catch(error){
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        console.log(error)
    } 

    
}
};