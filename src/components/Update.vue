<template>
  <v-card-text style="height: 300px;">
    <ul>
      <!-- (li>{2018.10.DD - v1.7.xx}ul>li{update notes})+br -->
      <li>
        2018.10.29 - v1.7.15, CSVs and Notices
        <ul>
          <li>CSV printouts now reflect what you see in the table in the same order</li>
          <li>Dirty incomplete Orders are now visible</li>
            <ul>
              <li>Does not account if user or admin did the update</li>
              <li>Does not account if order was triggered</li>
              <li>Only accounts if item was simply updated</li>
              <li>Any item under an Assay that has not been updated in the past 2 weeks starting from the Sunday of the current week will trigger a flag for the Assay</li>
            </ul>
          <li>Info button removed. Clicking on the item name will show item information</li>
        </ul>
      </li>
      <br>
      <li>
        2018.10.24 - v1.7.14, Orders
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
        2018.10.17 - v1.7.13, Bugs and Fixes
        <ul>
          <li><s>Server connections straightened out</s> Currently at 4041. No success restoring original address</li>
          <li>Add Item and Download CSV are removed from the speeddial for easier access</li>
        </ul>
      </li>
      <br>
      <li>
        2018.10.12 - v.1.7.12, Login
        <ul>
          <li>Header now shows who is logged in</li>
        </ul>
      </li>
      <br>
      <li>
        2018.10.11 - v1.7.11, Validation and Errors
        <ul>
          <li>Updated form validation for items</li>
          <li>Updated error message displays</li>
        </ul>
      </li>
      <br>
      <li>
        2018.10.10 - v1.7.10, Updating Reorder Values
        <ul>
          <li>Reorder quantities and points now update when Assay information changes, before only took effect when the item itself was updated</li>
          <li>Changed to numerical version numbers instead of letters</li>
          <li>Consolidated New Item and CSV download to one button</li>
        </ul>
      </li>
      <br>
      <li>
        2018.10.08 - v1.7i, CSV Export
        <ul>
          <li>Full active inventory can be exported as CSV</li>
        </ul>
      </li>
      <br>
      <li>
        2018.10.05 - v1.7h, Tiny Improvements
        <ul>
          <li>Added Go to Bottom button to easier access table scrollbar</li>
          <li>Fixed a bug with notifications displaying at the wrong time and closes them when a new form is opened</li>
        </ul>
      </li>
      <br>
      <li>
        2018.10.04 - v1.7g, Helpful Things
        <ul>
          <li>Go to Top button added when you scroll too far down</li>
          <li>Notifications added when things are saved, updated, or ordered</li>
          <li>Fixed the issue where pressing Enter to submit forms closes all open dialog boxes</li>
          <!-- <li>Error messages streamlined</li> -->
        </ul>
      </li>
      <br>
      <li>
        2018.10.01 - v1.7f, Order Bug Fixes
        <ul>
          <li>Fixed a bug with ordering where a new order form is constantly created</li>
          <li>Added a badge for manually ordered items in Order if it is under the reorder point</li>
          <li>Change "Order" button to "Manual Order" for clarity</li>
        </ul>
      </li>
      <br>
      <li>
        2018.09.27 - v1.7e, Minor Bug Fixes
        <ul>
          <!-- <li>Enter to submit only succeeds for topmost dialog</li> -->
          <li>Rounding errors scaled to account for JS math weirdness</li>
          <li>To Order column shows reorder amount if reorder point is triggered, may refine function in future</li>
        </ul>
      </li>
      <br>
      <li>
        2018.09.26 - v1.7d, Intuitiveness
        <ul>
          <li>Clicking on Item Name now brings up the Edit Item dialog, previously done on the info icon</li>
          <li>Info icon brings up the a separate tab for Item Info, read only</li>
        </ul>
      </li>
      <br>
      <li>
        2018.09.25 - v1.7c, Minor improvements
        <ul>
          <li>Update notes added to Header</li>
          <li>Calculation of Reorder Points now done whenever Item is updated and if it is active</li>
          <li>Enabled form submit on Enter for Item, Assay, Vendor, and Order Completion</li>
          <li>Ordering initialization fixed and ready to use</li>
        </ul>
      </li>
      <br>
      <li>
        2018.09.24 - v1.7b, Initial beta version
        <ul>
          <li>Able to enter/edit Item, Assay, and Vendor information</li>
          <li>Able to view Item information in a separate tab</li>
          <li>User and Admin modes</li>
        </ul>
      </li>
    </ul>
  </v-card-text>
</template>

<script>
export default {

}
</script>

<style scoped>

</style>
