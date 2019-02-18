<template>
  <v-card>
    <v-card-title class="headline">
      <img width="32" :src="getImage()">
      What's New!
    </v-card-title>
    <v-divider/>
    <v-card-text>
      <ul>
        <!-- (li>{2019.02.DD - v.1.xx}ul>li{update notes})+br -->
        <li>
          2019.02.18 - v.1.011
          <ul>
            <li>Others</li>
              <ul>
                <li>Autocomplete for passwords turned off</li>
                <li>Check session on intial page load and refresh</li>
                <li>Clarified Back and Accept in User Inventory's warning dialog</li>
              </ul>
          </ul>
        </li>
        <br>
        <li>
          2019.02.08 - v.1.01, Optimization and Bug Fixes
          <ul>
            <li>User Inventory</li>
            <ul>
              <li>Pagination added to decrease page load</li>
              <li>Fixed finicky detection of changed data entry</li>
            </ul>
            <li>Others</li>
            <ul>
              <li>Improvements under the hood to optimize processing speed</li>
            </ul>
          </ul>
        </li>
        <br>
        <li>
          2019.02.04 - v.1.00, User Authorization and Admin Login
          <ul>
            <li>Admin now has a login</li>
            <li>Admin can change their own settings</li>
            <li>User currently does not require a password</li>
          </ul>
        </li>
        <br>
        <li>
          2019.01.18 - v.b2.14, Catalog Information
          <ul>
            <li>User Inventory</li>
            <ul>
              <li>A popup will appear if an item passes a threshold (currentStock >= reorderPoint + reorderQuantity) and prompt the user to review the values</li>
              <li>Input method for current stock has changed to accept leading decimal points (Ex. 0.4 vs .4)</li>
              <li>An error message will open and card highlighted if the current stock has been entered incorrectly</li>
            </ul>
            <li>Catalog</li>
            <ul>
              <li>Allows access to details for items, assays, and vendors</li>
              <li>Admin will be able to edit information</li>
            </ul>
            <li>Others</li>
            <ul>
              <li>Admin can reactivate inactive data to be reused or repurposed for something else</li>
              <li>Activation and reassignments can be done in Admin Inventory</li>
              <li>Orders will now be split between completed and incomplete folders to reduce the number of visible items on the Order page</li>
              <li>Default values for new items changed</li>
            </ul>
          </ul>
        </li>
        <br>
        <li>
          2019.01.09 - v.b2.13; Catalog and Inactive, Error Handling
          <ul>
            <li>Catalog</li>
            <ul>
              <li>Show all active Items, Assays, and Vendors</li>
              <li>Admin can deactivate and reassign assay/vendors from here</li>
            </ul>
            <li>Inactive</li>
            <ul>
              <li>Only visible to admin</li>
              <li>Admin can reactivate data</li>
            </ul>
            <li>Others</li>
            <ul>
              <li>Added error handling for when server cannot be detected</li>
              <li>Item CSV back up for parameters now includes assay and vendor names</li>
            </ul>
          </ul>
        </li>
        <br>
        <li>
          2018.12.21 - v.b2.12; User Search, Single Item Edits, Order Edit
          <ul>
            <li>User Inventory</li>
            <ul>
              <li>Added search by item name, assay, vendor, catalog number, and description on User side</li>
              <li>Added single item update to User Inventory</li>
              <li>Added multi-assay filter to User Inventory</li>
            </ul>
            <li>Orders</li>
            <ul>
              <li>Able to edit current stock, order amount (admin only), and comments directly in Order</li>
              <li>Comments in Order and Inventory are linked until Order is completed</li>
              <li>Individual order entries can be removed (admin only)</li>
              <li>All edits and removals can only be done if Order has not yet been completed</li>
              <li>Order can be removed/deleted under certain condition (admin only)</li>
            </ul>
            <li>Others</li>
            <ul>
              <li>Improved backend code to batch updating Order Entries</li>
              <li>Improved backend code to updating Items</li>
            </ul>
          </ul>
        </li>
        <br>
        <li>
          2018.12.DD - v.b2.1, Bug Fixes
          <ul>
            <li>Changed Order url path to prevent conflicts from a running process</li>
            <li>UserInventory card transitions smoothened out</li>
            <li>Unsaved data flag turned off when navigating away from user inventory</li>
            <li>Admin can backup all data regardless of current inventory filters</li>
          </ul>
        </li>
        <br>
        <li>
          2018.12.12 - v.b2.1, User UI Update <v-icon small>far fa-smile-beam</v-icon>
          <ul>
            <li>User UI heavily overhauled</li>
            <ul>
              <li>Table changed to cards to display more information in a smaller space</li>
              <li>Batch update and order</li>
              <li>Will show results of update when information is submitted</li>
              <li>Warns user of unsaved data if navigating away from page</li>
              <li>Manual orders are now a radio button</li>
              <li>Filters and sorting</li>
            </ul>
            <li>Added dirty backup of database information for admin</li>
          </ul>
        </li>
        <br>
        <li>
          2018.12.06 - v.b2.05, Quick Fix
          <ul>
            <!-- <li>UI change for User</li> -->
            <!-- <li>Activation/deactivation of items, assay, vendors available</li> -->
            <li>Activation/deactivation of items</li>
            <li>Inactive items, assay, vendors visible</li>
            <li>Calculation formula added to Help in Header</li>
            <li><s>Fixed an issue where Assay or Vendor would not save despite no errors</s> Still under investigation</li>
          </ul>
        </li>
        <br>
        <li>
          2018.11.27 - v.b2.0, Workflow
          <ul>
            <li>UI and workflow rework</li>
            <li>Pre-filters added for Inventory</li>
            <li>Site keeps page history and displays most recent filters for Inventory and Order</li>
            <li>If accidentally ordered an item, can take back under certain conditions</li>
          </ul>
        </li>
        <br>
        <li>
          2018.11.05 - v.b1.7.17, Duplicates
          <ul>
            <li>Cleaned up duplicate Assay and Vendor validation when creating/editing Assays and Vendors</li>
          </ul>
        </li>
        <br>
        <li>
          2018.10.31 - v.b1.7.16, Quick Fix and Add All Assays
          <ul>
            <li>Quick fix to order of assays to be A->Z</li>
            <li>Outstanding assays will have a red number badge</li>
            <li>Show all assays for quick pick</li>
            <li>Adjusted Incomplete flag for items from 2 weeks to 1 week</li>
            <li>Clicking on the Stock or Comment of an item in the table will bring up the Edit Item dialog for that item</li>
          </ul>
        </li>
        <br>
        <li>
          2018.10.29 - v.b1.7.15, CSVs and Notices
          <ul>
            <li>CSV printouts now reflect what you see in the table in the same order</li>
            <li>Dirty incomplete Orders are now visible</li>
              <ul>
                <li>Does not account if user or admin did the update</li>
                <li>Does not account if order was triggered</li>
                <li>Only accounts if item was simply updated</li>
                <li>Any item under an Assay that has not been updated in the past 2 weeks starting from the Sunday of the current week will trigger a flag for the Assay</li>
                <li>Clicking on the assay name will filter the list for that assay</li>
              </ul>
            <li>Info button removed. Clicking on the item name will show item information</li>
          </ul>
        </li>
        <br>
        <li>
          2018.10.24 - v.b1.7.14, Orders
          <ul>
            <li>Added csv download to Orders</li>
            <li>Added assay name to Orders</li>
            <li>Creates a new Order for the week if current week's Order has already been completed. (ex: May 15 week completed. New Item ordered during May 15 week when Order was completed. Create new Order.)</li>
            <li>Item name currently being edited is visible</li>
            <li>Added pagination to deal with slow renders when a lot of data is on the screen</li>
          </ul>
        </li>
        <br>
        <li>
          2018.10.17 - v.b1.7.13, Bugs and Fixes
          <ul>
            <li><s>Server connections straightened out</s> Currently at 4041. No success restoring original address</li>
            <li>Add Item and Download CSV are removed from the speeddial for easier access</li>
          </ul>
        </li>
        <br>
        <li>
          2018.10.12 - v.b.1.7.12, Login
          <ul>
            <li>Header now shows who is logged in</li>
          </ul>
        </li>
        <br>
        <li>
          2018.10.11 - v.b1.7.11, Validation and Errors
          <ul>
            <li>Updated form validation for items</li>
            <li>Updated error message displays</li>
          </ul>
        </li>
        <br>
        <li>
          2018.10.10 - v.b1.7.10, Updating Reorder Values
          <ul>
            <li>Reorder quantities and points now update when Assay information changes, before only took effect when the item itself was updated</li>
            <li>Changed to numerical version numbers instead of letters</li>
            <li>Consolidated New Item and CSV download to one button</li>
          </ul>
        </li>
        <br>
        <li>
          2018.10.08 - v.b1.7i, CSV Export
          <ul>
            <li>Full active inventory can be exported as CSV</li>
          </ul>
        </li>
        <br>
        <li>
          2018.10.05 - v.b1.7h, Tiny Improvements
          <ul>
            <li>Added Go to Bottom button to easier access table scrollbar</li>
            <li>Fixed a bug with notifications displaying at the wrong time and closes them when a new form is opened</li>
          </ul>
        </li>
        <br>
        <li>
          2018.10.04 - v.b1.7g, Helpful Things
          <ul>
            <li>Go to Top button added when you scroll too far down</li>
            <li>Notifications added when things are saved, updated, or ordered</li>
            <li>Fixed the issue where pressing Enter to submit forms closes all open dialog boxes</li>
            <!-- <li>Error messages streamlined</li> -->
          </ul>
        </li>
        <br>
        <li>
          2018.10.01 - v.b1.7f, Order Bug Fixes
          <ul>
            <li>Fixed a bug with ordering where a new order form is constantly created</li>
            <li>Added a badge for manually ordered items in Order if it is under the reorder point</li>
            <li>Change "Order" button to "Manual Order" for clarity</li>
          </ul>
        </li>
        <br>
        <li>
          2018.09.27 - v.b1.7e, Minor Bug Fixes
          <ul>
            <!-- <li>Enter to submit only succeeds for topmost dialog</li> -->
            <li>Rounding errors scaled to account for JS math weirdness</li>
            <li>To Order column shows reorder amount if reorder point is triggered, may refine function in future</li>
          </ul>
        </li>
        <br>
        <li>
          2018.09.26 - v.b1.7d, Intuitiveness
          <ul>
            <li>Clicking on Item Name now brings up the Edit Item dialog, previously done on the info icon</li>
            <li>Info icon brings up the a separate tab for Item Info, read only</li>
          </ul>
        </li>
        <br>
        <li>
          2018.09.25 - v.b1.7c, Minor improvements
          <ul>
            <li>Update notes added to Header</li>
            <li>Calculation of Reorder Points now done whenever Item is updated and if it is active</li>
            <li>Enabled form submit on Enter for Item, Assay, Vendor, and Order Completion</li>
            <li>Ordering initialization fixed and ready to use</li>
          </ul>
        </li>
        <br>
        <li>
          2018.09.24 - v.b1.7b, Initial beta version
          <ul>
            <li>Able to enter/edit Item, Assay, and Vendor information</li>
            <li>Able to view Item information in a separate tab</li>
            <li>User and Admin modes</li>
          </ul>
        </li>
      </ul>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  methods: {
    getImage () {
      let rand = '0' + Math.floor(Math.random() * 3)

      return require(`../../img/nyancat${rand}.gif`)
    }
  }
}
</script>

<style scoped>

</style>
