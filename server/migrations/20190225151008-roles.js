const { User } = require('../models')
const { Role } = require('../models')
const { Department } = require('../models')

module.exports = {
  up: async function (queryInterface, Sequelize) {
    queryInterface.createTable('Roles', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING
      },
      isSubAdmin: {
        type: Sequelize.BOOLEAN
      },
      isAdmin: {
        type: Sequelize.BOOLEAN
      },
      isSuperAdmin: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    })

    queryInterface.addColumn('Users', 'RoleId', {
      type: Sequelize.UUID
    })

    const userRole = (await Role.create({name: 'User'})).toJSON()
    await Role.create({name: 'Sub Admin', isSubAdmin: true})
    const admin = (await Role.create({ name: 'Admin', isAdmin: true })).toJSON()
    const superAdmin = (await Role.create({ name: 'Super Admin', isSuperAdmin: true })).toJSON()

    await User.update({RoleId: admin.id}, { where: {} })
    await User.update({RoleId: superAdmin.id}, {
      where: {
        username: 'Administrator',
        isAdmin: true
      }
    })
    const department = (await Department.findOne({
      where: {
        name: 'Molecular'
      }
    })).toJSON()
    await User.create({}, department).then(user => {
      User.update({RoleId: userRole.id}, {
        where: {
          id: user.id
        }
      })
    })

    queryInterface.removeColumn('Users', 'isAdmin')
  },

  down: async function (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'isAdmin', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    })

    const user = (await Role.findOne({
      where: {
        isSubAdmin: false,
        isAdmin: false,
        isSuperAdmin: false
      }
    })).toJSON()

    await User.destroy({
      where: {
        RoleId: user.id
      }
    })

    queryInterface.removeColumn('Users', 'RoleId')
    queryInterface.dropTable('Roles')
  }
}
