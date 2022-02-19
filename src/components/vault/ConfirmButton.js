import React from "react";
import { Classes, Intent, Popover, Button, H5 } from "@blueprintjs/core";
import { useTranslations } from "../../hooks/i18n";

export default ({ icon, danger = false, title, description, primaryAction, onClick }) => {
    const t = useTranslations();
    return (
        <Popover popoverClassName={Classes.POPOVER_CONTENT_SIZING}>
            <Button icon={icon} intent={danger ? Intent.DANGER : Intent.NONE} />
            <div className={Classes.UI_TEXT}>
                <H5>{title}</H5>
                <p>{description}</p>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button text={t("cancel")} className={Classes.POPOVER_DISMISS} />
                    <Button
                        text={primaryAction}
                        onClick={onClick}
                        className={Classes.POPOVER_DISMISS}
                        intent={danger ? Intent.DANGER : Intent.PRIMARY}
                    />
                </div>
            </div>
        </Popover>
    );
};
