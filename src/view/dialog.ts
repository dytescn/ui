// src/view/dialog.ts
export const dialog_alert_tpl = `
<section class="vg-dialog-box">
  <div class="vg-dialog" id="dialog">
    <div class="vg-dialog-header"><%=it.title%></div>
    <div class="vg-dialog-body">
      <p class="font-size-13 color-gray-700 line-height-lg"><%=it.message%></p>
    </div>
    <div class="vg-dialog-footer">
      <button class="vg-btn" id="define">确定</button>
    </div>
  </div>
</section>`;

export const dialog_confirm_tpl = `
<section class="vg-dialog-box">
  <div class="vg-dialog" id="dialog">
    <div class="vg-dialog-header"><%=it.title%></div>
    <div class="vg-dialog-body">
      <p class="font-size-13 color-gray-700 line-height-lg"><%=it.message%></p>
    </div>
    <div class="vg-dialog-footer">
      <button class="vg-btn btn-type-error" id="define">确认</button>
      <button class="vg-btn" id="cancel">取消</button>
    </div>
  </div>
</section>`;