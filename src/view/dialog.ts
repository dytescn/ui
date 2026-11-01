// src/view/dialog.ts

// ---------- 基础对话框 ----------
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

// ---------- 多输入框对话框（每个输入框带 placeholder 提示） ----------
export const dialog_input_tpl = `
<section class="vg-dialog-box">
  <div class="vg-dialog" id="dialog">
    <div class="vg-dialog-header"><%= it.title %></div>
    <div class="vg-dialog-body">
      <% it.inputs.forEach(function(input){ %>
      <div class="vg-input-group mb-16">
        <label class="font-size-13 color-gray-700"><%= input.label %></label>
        <input type="text" id="<%= input.id %>" value="<%= input.value %>" 
               class="vg-input" placeholder="请输入 <%= input.label %>" autocomplete="off" />
      </div>
      <% }); %>
    </div>
    <div class="vg-dialog-footer">
      <button class="vg-btn btn-type-brand" id="define">确定</button>
      <button class="vg-btn" id="cancel">取消</button>
    </div>
  </div>
</section>`;