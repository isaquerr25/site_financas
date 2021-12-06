const Grids = require('../models/Grids');
const Manager = require('../models/ManagerValues');

module.exports = {
async index(req, res) {
    const { user_id, grid_id} = req.params;

    const grids = await Grids.findByPk(grid_id, {
    include: { association: 'manager_values' }
    });

    return res.json(grids.manager_values);
},

async store(req, res) {
    const { user_id , grid_id} = req.params;
    const { name, price ,date_inform, create_at } = req.body;

    const _grids = await Grids.findByPk(grid_id);

    if (!_grids) {
    return res.status(400).json({ error: 'User not found' });
    }

    const _manager = await Manager.create({
    name,
    price,
    date_inform,
    create_at,
    grid_id,
    });
    return res.json(_manager);
    },

    async dell(req, res) {
        const { user_id , grid_id} = req.params;
        const { id_delet } = req.body;
        console.log(id_delet)
        const _grids = await Grids.findByPk(grid_id);
    
        if (!_grids) {
        return res.status(400).json({ error: 'User not found' });
        }
        Manager.destroy({
            where: {
                id: id_delet //this will be your id that you want to delete
            }
            }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
            if(rowDeleted === 1){
                return res.status(200).json({ value: 'delete' });
            }
            }, function(err){
                console.log(err); 
            });
        
    },
};