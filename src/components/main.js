import abi from "../helpers/contact.json";
// import { GetContract } from "../helpers/Contract";
import { useState, useEffect } from "react";
import Account from "./account/";
import toast from "react-hot-toast";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { CopyToClipboard } from "react-copy-to-clipboard";

import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Card, Divider, CardActions, CardContent } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";

import logo from "../assets/logo.png";
import etherscan from "../assets/images/link/polygon.png";
import telegram from "../assets/images/link/telegram.png";
import twitter from "../assets/images/link/twitter.png";
import pdf from "../assets/whitePaper.pdf";

function Main(props) {
    const [copied, setCopied] = useState(false);

    const handleTooltipOpen = () => {
        setCopied(true);
    };

    const handleTooltipClose = () => {
        setCopied(false);
    };
    const [contractBalance, setContractBalance] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const [action, setActions] = useState(0);
    const [matic, setMATIC] = useState(0);
    const [reward, setReward] = useState(0);
    const { account, library } = useWeb3React();
    const [buttonStatus, setButtonStatus] = useState(false);
    const [buttonClick, setButtonClick] = useState(false);
    let contract, provider, signer;
    try {
        provider = new ethers.providers.Web3Provider(library.provider);
        signer = provider.getSigner();
        contract = new ethers.Contract("0xb5227e2490efa27dca16ec6900bc022b78210141", abi, signer);
    } catch (error) {
        contract = null;
    }
    const setRefUrl = () => {
        var path = "";
        if (contract) path = window.location.protocol + "//" + window.location.host + "?ref=" + account;
        else path = window.location.protocol + "//" + window.location.host;
        return path;
    };
    const queryParams = new URLSearchParams(
        window.location.href.toString().replace(window.location.protocol + "//" + window.location.host + "/", "")
    );
    const ref = queryParams.get("ref") ? queryParams.get("ref") : "0x0000000000000000000000000000000000000000";
    const checkContract = () => {
        if (contract) {
            return false;
        } else {
            toast.error("Wallet Error", { position: "bottom-left" });
            return true;
        }
    };
    const buyAction = async () => {
        if (checkContract()) return;
        if (matic <= 0) {
            toast.error("Set MATIC Value", { position: "bottom-left" });
            return;
        }
        setButtonStatus(true);
        setButtonClick(true);
        try {
            let value = await contract.acquireAction(ref, {
                value: ethers.utils.parseUnits(matic, 18),
                from: account,
            });
            value.wait();
        } catch (error) {
            console.log(error);
        }
        setButtonClick(false);
        setButtonStatus(false);
    };
    const reInvest = async () => {
        setButtonStatus(true);
        setButtonClick(true);

        if (checkContract()) return;
        try {
            let value = await contract.reinvestAction(ref);
            await value.wait();
            setButtonStatus(false);
            toast.success("ReInvest Successfully", { position: "bottom-left" });
        } catch (error) {
            toast.error("ReInvest Failed", { position: "bottom-left" });
            setButtonClick(false);
            setButtonStatus(false);
        }
    };
    const withdrawAction = async () => {
        if (checkContract()) return;
        setButtonClick(true);
        setButtonStatus(true);
        try {
            let value = await contract.dividenAction();
            await value.wait();
        } catch (error) {
            console.log(error);
        }
        setButtonStatus(false);
        setButtonClick(false);
    };
    useEffect(() => {
        if (contract) {
            if (!buttonClick) setButtonStatus(false);

            contract.getBalance().then((val) => {
                setContractBalance(ethers.utils.formatUnits(val, 18).toString());
            });
            library.getBalance(account).then((val) => {
                setWalletBalance(ethers.utils.formatUnits(val, 18).toString());
            });
            contract.getMyMiners().then((val) => {
                setActions(ethers.utils.formatUnits(val, 0).toString());
            });
            contract
                .getMyActions()
                .then(async (val) => {
                    console.log(val);
                    await contract.calculateActionSell(ethers.utils.formatUnits(val, 0) * 1).then((value) => {
                        setReward(ethers.utils.formatUnits(value, 18).toString());
                    });
                })
                .catch(() => {
                    setReward(0);
                });
        } else {
            setButtonStatus(true);
        }
    }, [account, library]);

    return (
        <Box className="customField">
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexFlow: { sm: "row", xs: "column" },
                    justifyContent: { sm: "space-between", xs: "center" },
                    my: 5,
                }}
            >
				<box>
			   <Button variant="contained">
                    <a href="https://www.maticwallstreet.com/" target="_blank" className="customButton"
					>
                        Home
                    </a>
					</Button>
					
					
					<Button variant="contained">
                    <a
                        href="https://docs.maticwallstreet.com/"
                        // target="_blank"
                        className="customButton"
                    >
                        Tutorials
                    </a>
                </Button>
				</box>
                <box><img src={logo} style={{ width: "150px" }} /></box>
                <Box sx={{ width: "300px" }} variant="contained">
                    <Account />
                </Box>
            </Box>
            <Box className="slogan">
                <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: { sm: "30px", xs: "20px" } }} gutterBottom component="div">
                     Matic's pool with great daily performance 
                    <br />
                    and the highest referral reward to friends set on Wall Street
                </Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Card sx={{ width: "90%" }} className="mCard">
                        <CardContent>
							<Typography variant="h5" gutterBottom component="div" sx={{ borderBottom: "solid 6px", pb: 1, textAlign: "center" }}>
                                Minning Pool
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Contract
                                    </Typography>
                                    <Typography variant="h6" gutterBottom component="div">
                                        {Number(contractBalance).toFixed(4) * 1} MATIC
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Wallet
                                    </Typography>
                                    <Typography variant="h6" gutterBottom component="div">
                                        {Number(walletBalance).toFixed(4) * 1} MATIC
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Your Actions
                                    </Typography>
                                    <Typography variant="h6" gutterBottom component="div">
                                        {Number(action).toFixed(4) * 1} Actions
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <OutlinedInput
                                        value={matic}
                                        fullWidth
                                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                        onChange={(event) => {
                                            setMATIC(event.target.value);
                                        }}
                                        className="maticValue"
                                        type="number"
                                        endAdornment={
                                            <InputAdornment position="end" sx={{ color: "white" }}>
                                                MATIC
                                            </InputAdornment>
                                        }
                                        aria-describedby="outlined-weight-helper-text"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        className="customButton"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={buttonStatus}
                                        sx={{ my: 1 }}
                                        onClick={() => {
                                            buyAction();
                                        }}
                                    >
                                        BUY ACTION
                                    </Button>
                                    <hr />
                                </Grid>
                                <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Your Dividends
                                    </Typography>
                                    <Typography variant="h6" gutterBottom component="div">
                                        {Number(reward).toFixed(4) * 1} MATIC
                                    </Typography>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <Button
                                        className="customButton"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={buttonStatus}
                                        sx={{ my: 1 }}
                                        onClick={() => {
                                            reInvest();
                                        }}
                                    >
                                        RE-INVEST
                                    </Button>
                                </Grid>
                                <Grid item sm={6} xs={12}>
                                    <Button
                                        className="customButton"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={buttonStatus}
                                        sx={{ my: 1 }}
                                        onClick={() => {
                                            withdrawAction();
                                        }}
                                    >
                                        WITHDRAW DIVIDENDS
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card sx={{ width: "90%", pb: 0 }} className="mCard">
                        <CardContent>
                            <Typography variant="h5" gutterBottom component="div" sx={{ borderBottom: "solid 6px", pb: 1, textAlign: "center" }}>
                                Project Info
                            </Typography>
                            <Grid container sx={{ mt: 1 }}>
                                <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Daily Return
                                    </Typography>
                                    <Typography variant="h6" gutterBottom component="div">
                                        up to 10%
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        APR
                                    </Typography>
                                    <Typography variant="h6" gutterBottom component="div">
                                        on average 3,650 %
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Dev Fee
                                    </Typography>
                                    <Typography variant="h6" gutterBottom component="div">
                                        5 %
                                    </Typography>
                                </Grid>
                               
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card sx={{ width: "90%", pb: 0, textAlign: "center" }} className="mCard">
                        <CardContent>
                            <Typography variant="h5" gutterBottom component="div" sx={{ borderBottom: "solid 6px", pb: 1, textAlign: "center" }}>
                                Referral Link
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={9}>
                                    <OutlinedInput fullWidth readOnly size="small" sx={{ mb: 2, color: "white" }} value={setRefUrl()} />
                                </Grid>
                                <Grid item xs={3}>
                                    <CopyToClipboard text={setRefUrl()} onCopy={handleTooltipOpen}>
                                        <Tooltip title="Copied" open={copied} onClose={handleTooltipClose}>
                                            <Button className="customButton" variant="contained" fullWidth>
                                                COPY
                                            </Button>
                                        </Tooltip>
                                    </CopyToClipboard>
                                </Grid>
                            </Grid>
                            <Typography variant="subtitle1" gutterBottom component="div">
                                Earn up to 15% of the MATIC used to buy Actions from anyone who uses your referral link
                            </Typography>
                        </CardContent>
                    </Card>
					<Card sx={{ width: "90%", pb: 0, textAlign: "center" }} className="mCard">
						<CardContent>
							<Typography variant="h5" gutterBottom component="div" sx={{ borderBottom: "solid 6px", pb: 1, textAlign: "center" }}>
                                Usefull Links
                            </Typography>
							<Button variant="contained">
								<a href="https://www.binance.me/es-LA/activity/referral/offers/claim?ref=CPA_00200TJ1PB" target="_blank" className="customButton">
								Buy MATIC on Binance
								</a>
							</Button>
						</CardContent>
					</Card>
                </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
                <a href="https://polygonscan.com/address/0xb5227e2490efa27dca16ec6900bc022b78210141" target="_blank">
                    <img src={etherscan} />
                </a>
                <a href="https://t.me/maticwallstreet" target="_blank">
                    <img src={telegram} style={{ margin: "auto 15px" }} />
                </a>
                <a href="https://twitter.com/maticwallstreet" target="_blank">
                    <img src={twitter} />
                </a>
            </Box>
        </Box>
    );
}

Main.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default Main;
