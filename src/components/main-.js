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
    const [tree, setTrees] = useState(0);
    const [matic, setMATIC] = useState(0);
    const [reward, setReward] = useState(0);
    const { account, library } = useWeb3React();
    const [buttonStatus, setButtonStatus] = useState(false);
    const [buttonClick, setButtonClick] = useState(false);
    let contract, provider, signer;
    let contract1;
    try {
        provider = new ethers.providers.Web3Provider(library.provider);
        signer = provider.getSigner();
        contract1 = new ethers.Contract("0x76904ff58c2C441fa696eC498752F3dd90FbD892", abi, signer);
        contract = new ethers.Contract("0xA094BbF8BB697170925aBFAD4161eb621eaAE970", abi, signer);
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
    const plantTree = async () => {
        if (checkContract()) return;
        if (matic <= 0) {
            toast.error("Set MATIC Value", { position: "bottom-left" });
            return;
        }
        setButtonStatus(true);
        setButtonClick(true);
        try {
            let value = await contract.plantAvocado(ref, {
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
    const rePlant = async () => {
        setButtonStatus(true);
        setButtonClick(true);

        if (checkContract()) return;
        try {
            let value = await contract.replantAvocado(ref);
            await value.wait();
            setButtonStatus(false);
            toast.success("Replant Successfully", { position: "bottom-left" });
        } catch (error) {
            toast.error("Replant Failed", { position: "bottom-left" });
            setButtonClick(false);
            setButtonStatus(false);
        }
    };
    const cutTree = async () => {
        if (checkContract()) return;
        setButtonClick(true);
        setButtonStatus(true);
        try {
            let value = await contract.eatAvocado();
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
                contract1.getBalance().then((val1) => {
                    setContractBalance(ethers.utils.formatUnits(val, 18) * 1 + ethers.utils.formatUnits(val1, 18) * 1);
                });
            });
            library.getBalance(account).then((val) => {
                setWalletBalance(ethers.utils.formatUnits(val, 18).toString());
            });
            contract.getMyMiners().then((val) => {
                setTrees(ethers.utils.formatUnits(val, 0).toString());
            });
            contract
                .getMySeeds()
                .then(async (val) => {
                    console.log(val);
                    await contract.calculateSeedSell(ethers.utils.formatUnits(val, 0) * 1).then((value) => {
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
                <Box>
                    <a href={pdf} target="_blank" className="customButton">
                        White Paper
                    </a>
                    <a
                        href="#"
                        // target="_blank"
                        className="customButton"
                    >
                        Audit Report
                    </a>
                </Box>
                <img src={logo} style={{ width: "150px" }} />
                <Box sx={{ width: "300px" }}>
                    <Account />
                </Box>
            </Box>
            <Box className="slogan">
                <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: { sm: "30px", xs: "20px" } }} gutterBottom component="div">
                    The MATIC Pool with the finest daily
                    <br />
                    return and highest referral reward
                </Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Card sx={{ width: "90%" }} className="mCard">
                        <CardContent>
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
                                        Your Trees
                                    </Typography>
                                    <Typography variant="h6" gutterBottom component="div">
                                        {Number(tree).toFixed(4) * 1} Trees
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
                                            plantTree();
                                        }}
                                    >
                                        PLANT TREE
                                    </Button>
                                    <hr />
                                </Grid>
                                <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Your Rewards
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
                                            rePlant();
                                        }}
                                    >
                                        RE-PLANT
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
                                            cutTree();
                                        }}
                                    >
                                        CUT TREE
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card sx={{ width: "90%", pb: 0 }} className="mCard">
                        <CardContent>
                            <Typography variant="h5" gutterBottom component="div" sx={{ borderBottom: "solid 6px", pb: 1 }}>
                                Harvest Facts
                            </Typography>
                            <Grid container sx={{ mt: 1 }}>
                                <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Daily Return
                                    </Typography>
                                    <Typography variant="h6" gutterBottom component="div">
                                        10 %
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        APR
                                    </Typography>
                                    <Typography variant="h6" gutterBottom component="div">
                                        3,650 %
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Dev Fee
                                    </Typography>
                                    <Typography variant="h6" gutterBottom component="div">
                                        3 %
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Marketing Fee
                                    </Typography>
                                    <Typography variant="h6" gutterBottom component="div">
                                        4 %
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card sx={{ width: "90%", pb: 0, textAlign: "center" }} className="mCard">
                        <CardContent>
                            <Typography variant="h5" gutterBottom component="div">
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
                                Earn 15% of the MATIC used to plant trees from anyone who uses your referral link
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
                <a href="https://polygonscan.com/address/0x76904ff58c2c441fa696ec498752f3dd90fbd892" target="_blank">
                    <img src={etherscan} />
                </a>
                <a href="https://t.me/Growavocadohass" target="_blank">
                    <img src={telegram} style={{ margin: "auto 15px" }} />
                </a>
                <a href="" target="_blank">
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
