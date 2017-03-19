/**
 * Created by gdev on 3/18/2017.
 */
function save_options() {
    var tabsBackground = document.getElementById('tabsBackground').value;
    chrome.storage.sync.set({
        tabsBackground: tabsBackground
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores tabsBackground state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        tabsBackground: true
    }, function(items) {
        document.getElementById('tabsBackground').value = items.tabsBackground;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
