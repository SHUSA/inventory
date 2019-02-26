const { User } = require('../models')
const { Role } = require('../models')

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

    // queryInterface.removeColumn('Users', 'RoleId')
    // queryInterface.dropTable('Roles')

    await Role.create({name: 'User'})
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

    queryInterface.removeColumn('Users', 'isAdmin')
  },

  down: async function (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'isAdmin', {
      type: Sequelize.STRING,
      defaultValue: false
    })

    const admin = (await Role.findOne({
      where: {
        isAdmin: true
      }
    })).toJSON()
    const superAdmin = (await Role.findOne({
      where: {
        isSuperAdmin: true
      }
    })).toJSON()

    await User.update({isAdmin: true}, {
      where: {
        RoleId: [admin, superAdmin]
      }
    })

    queryInterface.removeColumn('Users', 'RoleId')
    queryInterface.dropTable('Role')
  }
}
