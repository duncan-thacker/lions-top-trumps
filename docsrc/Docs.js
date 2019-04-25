import React, { useState } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import AvatarEditor from "react-avatar-editor";
import { blue, red } from "@material-ui/core/colors";
import { Button } from "@material-ui/core";
import { hot } from "react-hot-loader/root";
import html2canvas from "html2canvas";

const docsTheme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: red
    },
    typography: {
        useNextVariants: true,
    }
});

const cardId = "thecard";

function savePngImage(htmlElementId, characterName) {
    const htmlElement = document.getElementById(htmlElementId);
    html2canvas(htmlElement).then(canvas => {
        const imageDownloadElement = document.createElement("a");
        imageDownloadElement.href = canvas.toDataURL();
        imageDownloadElement.download = `Lions-Top-Trump-${ encodeURIComponent(characterName) }.png`;
        document.body.appendChild(imageDownloadElement);
        imageDownloadElement.click();
        document.body.removeChild(imageDownloadElement);
    }).catch(error => {
        console.error(error);
    });
}

const STEALTH_STYLE = {
    background: "none",
    border: "none",
    outline: "none",
    fontFamily: "inherit",
    fontSize: "inherit",
    color: "inherit"
};

const SCORE_LABEL_STYLE = {
    width: "50%",
    textAlign: "right",
    marginRight: "16px"
};
const SCORE_ROW_STYLE = {
    fontSize: 26,
    display: "flex",
    alignItems: "center",
    marginTop: 3
};
const SCORE_STYLE = {
    ...STEALTH_STYLE,
    paddingBottom: 6,
    fontWeight: "bold",
    fontSize: "120%"
};

function CharacterCard({ elementId, name, title, picture, scores, onScoresChange, onPictureChange, onNameChange, onTitleChange, picturePosition, onPicturePositionChange }) {

    function handleImageLoad(event) {
        var reader = new FileReader();

        reader.onload = loadEvent => {
            onPictureChange(loadEvent.target.result);
        };
        reader.readAsDataURL(event.target.files[0]);
    }

    function handleChangeScore(scoreLabel, newValue) {
        onScoresChange({
            ...scores,
            [scoreLabel]: newValue
        });
    }

    return (
        <div id={ elementId } style={ { fontFamily: "BlackChancery", width: "500px", height: "700px", color: "#dd9", backgroundColor: "#700d05", borderRadius: 18 } }>
            <div style={ { fontSize: "40px", margin: "2px 8px" } }>
                <input style={ { ...STEALTH_STYLE, width: "100%" } } value={ name } onChange={ event => onNameChange(event.target.value) } placeholder="Enter your name here" />
            </div>
            <div style={ { fontSize: "22px", margin: "-4px 8px 2px 8px", color: "#aa8" } }>
                <input style={ { ...STEALTH_STYLE, width: "100%" } } value={ title } onChange={ event => onTitleChange(event.target.value) } placeholder="Enter your title here" />
            </div>
            <div style={ { margin: "0 5px", height: "300px", border: "1px solid #dd9" } }>
                {
                    picture ?
                        <AvatarEditor border={ 0 } image={ picture } width={ 490 } height={ 300 } position={ picturePosition } onPositionChange={ onPicturePositionChange } /> :
                        <input style={ { margin: "120px" } } type="file" accept="image/png, image/jpeg" onChange={ handleImageLoad } />
                }
            </div>
            <div>
                {
                    Object.keys(scores).map(scoreLabel => (
                        <div key={ scoreLabel } style={ SCORE_ROW_STYLE }>
                            <div style={ SCORE_LABEL_STYLE }>
                                { scoreLabel }
                            </div>
                            <input style={ SCORE_STYLE } value={ scores[scoreLabel] } onChange={ event => handleChangeScore(scoreLabel, event.target.value) } />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

function Docs() {
    const [ name, setName ] = useState("Your Name (click to edit)");
    const [ title, setTitle ] = useState("Your Title (click to edit)");
    const [ picture, setPicture ] = useState(undefined);
    const [ picturePosition, setPicturePosition ] = useState(undefined);
    const [ scores, setScores ] = useState({ Combat: 5, Intimidation: 5, "Political Skill": 5, Respected: 5, Intelligence: 5, Heroism: 5 });

    function handleDiscardImage() {
        setPicturePosition(undefined);
        setPicture(undefined);
    }

    return (
        <MuiThemeProvider theme={ docsTheme }>
            <CharacterCard
                elementId={ cardId }
                name={ name }
                title={ title }
                scores={ scores }
                onScoresChange={ setScores }
                onNameChange={ setName }
                onTitleChange={ setTitle }
                picture={ picture }
                onPictureChange={ setPicture }
                picturePosition={ picturePosition }
                onPicturePositionChange={ setPicturePosition }
            />
            <div style={{ marginTop: "20px"}}>
                {
                    picture && <Button onClick={ handleDiscardImage }>Discard image</Button>
                }
                <Button onClick={ () => savePngImage(cardId, name) } variant="contained" color="primary">Save as PNG</Button>
            </div>
        </MuiThemeProvider>
    );
}

export default hot(Docs);
