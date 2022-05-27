import { Fragment, useState } from "react";
import Button from "@mui/material/Button";
import WalletProviders from "./NetworkWalletProviders";
import WalletIcon from "../ui/icons/Wallet";

const Unauthenticated = () => {
    const [walletProvidersDialogOpen, setWalletProvidersDialogOpen] = useState(false);

    const handleWalletProvidersDialogToggle = () => {
        setWalletProvidersDialogOpen(!walletProvidersDialogOpen);
    };

    return (
        <Fragment>
            <Button
                variant="contained"
                disableElevation
                className="customButton"
                fullWidth
                onClick={handleWalletProvidersDialogToggle}
                startIcon={<WalletIcon />}
            >
                Connect Wallet
            </Button>
            <WalletProviders
                walletProvidersDialogOpen={walletProvidersDialogOpen}
                handleWalletProvidersDialogToggle={handleWalletProvidersDialogToggle}
            />
        </Fragment>
    );
};

export default Unauthenticated;
