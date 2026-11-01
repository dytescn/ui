// src/view/dialog.ts
export const dialog_delete_tpl = `<section class="vg-dialog-box">
    <div class="vg-dialog" id="dialog">
        <div class="vg-dialog-header">删除确认</div>
        <div class="vg-dialog-body">
            <p class="font-size-13 color-gray-700 line-height-lg">确定删除素材吗？删除后将无法恢复。</p>
        </div>
        <div class="vg-dialog-footer">
            <button class="vg-btn btn-type-error" id="define"> 确认 </button>
            <button class="vg-btn" id="cancel"> 取消</button>
        </div>
    </div>
</section>`;

export const dialog_input_tpl = `
<section class="vg-dialog-box">
    <div class="vg-dialog" id="dialog">
        <div class="vg-dialog-header"><%=it.info.title%></div>
        <div class="vg-dialog-body">
            <div class="vg-input" id="dialog-input">
                <input type="text" placeholder="<%=it.info.placeholder%>">
                <p class="error-tip"></p>
            </div>
        </div>
        <div class="vg-dialog-footer">
            <button class="vg-btn btn-type-brand" id="define"> 确定 </button>
            <button class="vg-btn" id="cancel"> 取消</button>
        </div>
    </div>
</section>`;