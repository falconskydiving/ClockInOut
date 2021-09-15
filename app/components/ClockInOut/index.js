import React, { Component } from "react";
import { Platform, PermissionsAndroid, ToastAndroid, AppState, Alert, ScrollView, Text, TextInput, View, TouchableHighlight, TouchableWithoutFeedback, Button, Image } from "react-native";
import GoHome from './import/GoHome';
import Modal from "react-native-modal"
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

import styles from './css/style'
import stylesOkModal from './css/cssokmodal'
import stylesWarnModal from './css/csswarnmodal'
import stylesLocationModal from './css/csslocationmodal'
import Clock from './clock'
import TimeInOutBtn from './timeInOutBtn'

export default class ClockInOut extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props)

       
        this.state = {

            spinner: false,

            server_url: '',

            email: "",
            password: "",
            idno: "",

            loading: false,
            updatesEnabled: false,
            location: {},

            type: "timein",
            ip_label: "",
            client_ip: "",
            city_name: "",
            country_name: "",
            latitude: "",
            longitude: "",
            isLoadingLocation: 0,

            message: "",
            fullname: "",
            typeLabel: "",
            time: "",

        };
        // Bind the this context to the handler function
        this.getType = this.getType.bind(this);
        this.clockElement = React.createRef();
        this.clockInOut = this.clockInOut.bind(this);
    }

    componentWillMount() {
        this._getServerUrlInfo()
    }

    _getServerUrlInfo = async () => {
        try {
            const value = await AsyncStorage.getItem('@SERVER_URL')
            if (value !== null) {
                // value previously stored
                this.setState({ server_url: value });
                this.getLocation();
            } else {
                this.setState({ visibleModal: 'sliding' })
            }
        } catch (e) {
            // error reading value
        }
    }

    _registerServerUrl = async () => {
        try {
            if (this.state.server_url.length > 0) {
                await AsyncStorage.setItem('@SERVER_URL', this.state.server_url)
                this.setState({ visibleModal: null });
                this.getLocation();
            }
        } catch (e) {
            // save error
        }
    }

    _getLoginDetailsInfo = async () => {
        try {
            const email = await AsyncStorage.getItem('@EMAIL')
            const password = await AsyncStorage.getItem('@PASSWORD')
            if (email != null && password != null) {
                // value previously stored
                this.setState({ email: email });
                this.setState({ password: password });
            }
        } catch (e) {
            // error reading value                                
        }
    }
    _registerLoginDetailsInfo = async () => {
        try {
            if (this.state.email.length > 0 && this.state.password.length > 0) {
                await AsyncStorage.setItem('@EMAIL', this.state.email);
                await AsyncStorage.setItem('@PASSWORD', this.state.password);
            }
        } catch (e) {
            // save error
        }
    }
    _goHome = async () => {
        if (Platform.OS == 'android')
            GoHome.run();
        else
            GoHome.goToHome();
    }

    hasLocationPermission = async () => {
        if (Platform.OS === 'ios' ||
            (Platform.OS === 'android' && Platform.Version < 23)) {
            return true;
        }
        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (hasPermission) return true;

        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

        if (status === PermissionsAndroid.RESULTS.DENIED) {
            ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
        }
        return false;
    }

    getLocation = async () => {
        const hasLocationPermission = await this.hasLocationPermission();
        if (!hasLocationPermission) return;
        this.setState({ spinner: true });                     //spinner 
        this.setState({ loading: true }, () => {

            Geolocation.getCurrentPosition(
                (position) => {
                    console.log(position);
                    let lat = (String)(position.coords.latitude);
                    let lng = (String)(position.coords.longitude);

                    let BASE_URL = 'https://' + this.state.server_url + '/';
                    let api = 'geoCodeLatLng';

                    let url = new URL(`${BASE_URL}${api}`)

                    let params = { latitude: lat, longitude: lng }
                    if (params != null) Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

                    fetch(url, {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((res) => res.json())
                    .then((resJson) => {
                            this.setState({ spinner: false });                     //spinner  
                            let geolocation = resJson.geolocation;
                            this.state.client_ip = resJson.client_ip;                           //'46.246.118.243'

                            switch (geolocation.status) {
                                case 'ZERO_RESULTS':
                                    $('#error_message').text("No result.");
                                    this.setState({
                                        ip_label: "",
                                        city_name: "",
                                        country_name: "",
                                        latitude: "",
                                        longitude: "",
                                        isLoadingLocation: 0,
                                    });
                                    break;
                                case 'OK':
                                    this._getLoginDetailsInfo();                                //check remember login details 
                                   
                                    this.setState({
                                        ip_label: "Your IP: ",
                                        city_name: geolocation.results[0].formatted_address,            // "Folketshusvägen 76049, 760 49 Herräng, Sweden",
                                        country_name: "",
                                        latitude: geolocation.results[0].geometry.location.lat,         //60.1280991,
                                        longitude: geolocation.results[0].geometry.location.lng,        //18.643959,
                                        isLoadingLocation: 1,
                                    });
                                    break;
                                default:
                                    $('#error_message').text(geolocation.error_message);
                                    this.setState({
                                        ip_label: "",
                                        city_name: "",
                                        country_name: "",
                                        latitude: "",
                                        longitude: "",
                                        isLoadingLocation: 0,
                                    });
                            }
                        })
                        .catch((ex) => {
                            this.setState({ spinner: false, visibleModal: 'wrongapilocation' });                     //spinner  
                            // setTimeout(function(){
                            //     this.setState({ visibleModal: 'wrongapilocation' })
                            // }, 100);
                            console.log("Fetch Exception", ex)
                    });
                },
                (error) => {
                    this.setState({ spinner: false });                     //spinner
                    Alert.alert("No Permission!", "You can't get your position info.")
                    this.setState({ location: error, loading: false });
                    console.log(error);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50 }
            );
        });
    }

    // This method will be sent to the TimeInOut component
    getType(res) {
        this.setState({ type: res });
    }
    _onPressBtnConfirm() {
        if (this.state.isLoadingLocation == 1) {
            this.clockElement.current.getDateTime(this);
        }
    }
    _onPressBtnEditApi() {
        this.setState({ ip_label: '' })
        this.setState({ client_ip: '' })
        this.setState({ city_name: '' })
        this.setState({ country_name: '' })
        this.setState({ latitude: '' })
        this.setState({ longitude: '' })
        this.setState({ isLoadingLocation: 0 })
        this.setState({ visibleModal: 'editapi' })
    }

    clockInOut(panel, currentTime, currentDate) {
        let BASE_URL = 'https://' + panel.state.server_url + '/';

        if (panel.state.type == "timein") {
            let api = 'clockIn';

            let url = new URL(`${BASE_URL}${api}`);

            let params = {
                idno: panel.state.idno, email: panel.state.email, password: panel.state.password, date: currentDate, time: currentTime,
                client_ip: panel.state.client_ip, city_name: panel.state.city_name, country_name: panel.state.country_name, latitude: panel.state.latitude, longitude: panel.state.longitude,
            };

            if (params != null) Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            this.setState({ spinner: true });                     //spinner
            fetch(url, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((resJson) => {
                    this.setState({ spinner: false });                     //spinner
                    if (resJson.error != null) {
                        panel.setState({ visibleModal: 'warning' })
                        // let prefix = () => {
                        //     let gender = resJson.gender
                        //     var civilstatus = resJson.civilstatus;
                        //     if (gender == "MALE") { if (civilstatus == "SINGLE") { return "Sr"; } else if (civilstatus == "MARRIED") { return "Sr"; } else if (civilstatus == "ANULLED") { return "Sr"; } else if (civilstatus == "LEGALLY SEPARATED") { return "Sr"; } else { return ''; } }
                        //     if (gender == "FEMALE") { if (civilstatus == "SINGLE") { return "Srta"; } else if (civilstatus == "MARRIED") { return "Sra"; } else if (civilstatus == "ANULLED") { return "Sra"; } else if (civilstatus == "LEGALLY SEPARATED") { return "Sra"; } else { return ''; } }
                        // }
                        panel.setState({ message: resJson.error });
                        // if (resJson.employee != '' && resJson.employee != undefined) {
                        //     panel.setState({ fullname: prefix() + ' ' + resJson.employee });
                        // }
                    } else {
                        panel.setState({ visibleModal: 'success' });
                        panel.setState({ fullname: resJson.firstname + ' ' + resJson.lastname });
                        panel.setState({ typeLabel: "Hora de Entrada at " });
                        panel.setState({ time: decodeURI(resJson.time) });

                        this._registerLoginDetailsInfo();                           //register remember login details 

                        setTimeout(function () {
                            panel._goHome();
                        }, 10000);
                    }
                })
                .catch((ex) => {
                    this.setState({ spinner: false });                     //spinner
                    this.setState({ visibleModal: 'conerror' })
                    console.log("Fetch Exception", ex)
                });

        } else if (panel.state.type == "timeout") {
            let api = 'clockOut';

            let url = new URL(`${BASE_URL}${api}`);

            let params = {
                idno: panel.state.idno, email: panel.state.email, password: panel.state.password, date: currentDate, time: currentTime,
                client_ip: panel.state.client_ip, city_name: panel.state.city_name, country_name: panel.state.country_name, latitude: panel.state.latitude, longitude: panel.state.longitude,
            };

            if (params != null) Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            this.setState({ spinner: true });                     //spinner
            fetch(url, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((resJson) => {
                    this.setState({ spinner: false });                     //spinner
                    if (resJson.error != null) {
                        panel.setState({ visibleModal: 'warning' })
                        // let prefix  = () => {
                        //     let gender = resJson.gender;
                        //     var civilstatus = resJson.civilstatus;
                        //     if (gender == "MALE") { if (civilstatus == "SINGLE") { return "Sr"; } else if (civilstatus == "MARRIED") { return "Sr"; } else if (civilstatus == "ANULLED") { return "Sr"; } else if (civilstatus == "LEGALLY SEPARATED") { return "Sr"; } else { return ''; } }
                        //     if (gender == "FEMALE") { if (civilstatus == "SINGLE") { return "Srta"; } else if (civilstatus == "MARRIED") { return "Sra"; } else if (civilstatus == "ANULLED") { return "Sra"; } else if (civilstatus == "LEGALLY SEPARATED") { return "Sra"; } else { return ''; } }
                        // }
                        panel.setState({ message: resJson.error });
                        // if (resJson.employee != '' && resJson.employee != undefined) {
                        //     panel.setState({ fullname: prefix() + ' ' + resJson.employee });
                        // }
                    } else {
                        panel.setState({ visibleModal: 'success' });
                        panel.setState({ fullname: resJson.firstname + ' ' + resJson.lastname });
                        panel.setState({ typeLabel: "Hora de Salida at " });
                        panel.setState({ time: decodeURI(resJson.time) });

                        this._registerLoginDetailsInfo();                               //register remember login details

                        setTimeout(function () {
                            panel._goHome();
                        }, 10000);

                    }
                })
                .catch((ex) => {
                    this.setState({ spinner: false });                     //spinner
                    this.setState({ visibleModal: 'conerror' })
                    console.log("Fetch Exception", ex)
                });
        }
    }
    render() {

        return (
            <ScrollView style={styles.container}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Cargando...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <TimeInOutBtn setType={this.getType}></TimeInOutBtn>
                <Clock pickDateTime={this.clockInOut} ref={this.clockElement}></Clock>

                <View style={styles.clockwrapper}>
                    <TextInput placeholder="Email" style={styles.enterInput} onChangeText={(email) => this.setState({ email })} value={this.state.email} />
                    <TextInput placeholder="Contraseña" secureTextEntry={true} style={styles.enterInput} onChangeText={(password) => this.setState({ password })} value={this.state.password} />

                    <View style={styles.confirmidwrapper}>
                        <View style={styles.enterIDInputwrapper}>
                            <TextInput placeholder="Introduzca su PIN" style={styles.enterIDInput} onChangeText={(idno) => this.setState({ idno })} value={this.state.idno} />
                        </View>
                        <View style={styles.confirmbtnwrapper}>
                            <TouchableHighlight onPress={this._onPressBtnConfirm.bind(this)} underlayColor="white">
                                <View style={styles.btnconfirm}>
                                    <Text style={styles.btnconfirmlabel}>Confirmar</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>

                    <View style={styles.locationpanel}>
                        <View style={styles.ipwrapper}>
                            <Text style={styles.ipcontent}>{this.state.client_ip}</Text>
                        </View>
                        <View style={styles.citywrapper}>
                            <Text style={styles.locationinfo}>{this.state.city_name}</Text>
                        </View>
                        <View style={styles.latlngeditapiwrapper}>
                            <View style={styles.latlngwrapper}>
                                <Text style={styles.locationinfo}>{this.state.latitude}{this.state.isLoadingLocation == 1 ? ", " : ""}</Text>
                                <Text style={styles.locationinfo}>{this.state.longitude}</Text>
                            </View>
                            <TouchableWithoutFeedback onPress={this._onPressBtnEditApi.bind(this)}>
                                <View style={styles.editapiwrapper}>
                                    <Image source={require('./img/edit_api.png')} style={styles.editapibtn} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>

                    <Modal
                        isVisible={this.state.visibleModal === 'success'}
                        backdropColor="#B4B3DB"
                        backdropOpacity={0.8}
                        animationIn="zoomInDown"
                        animationOut="zoomOutUp"
                        animationInTiming={600}
                        animationOutTiming={600}
                        backdropTransitionInTiming={600}
                        backdropTransitionOutTiming={600}
                        onBackdropPress={() => this.setState({ visibleModal: null })}
                    >
                        {this.renderModalSuccessContent()}
                    </Modal>
                    <Modal
                        isVisible={this.state.visibleModal === 'warning'}
                        backdropColor="#B4B3DB"
                        backdropOpacity={0.8}
                        animationIn="zoomInDown"
                        animationOut="zoomOutUp"
                        animationInTiming={600}
                        animationOutTiming={600}
                        backdropTransitionInTiming={600}
                        backdropTransitionOutTiming={600}
                        onBackdropPress={() => this.setState({ visibleModal: null })}
                    >
                        {this.renderModalWarningContent()}
                    </Modal>
                    <Modal
                        isVisible={this.state.visibleModal === 'sliding'}
                        animationIn="slideInLeft"
                        animationOut="slideOutRight"
                    >
                        {this.renderModalServerUrlContent()}
                    </Modal>
                    <Modal
                        isVisible={this.state.visibleModal === 'editapi'}
                        animationIn="slideInLeft"
                        animationOut="slideOutRight"
                    >
                        {this.renderModalEditServerUrlContent()}
                    </Modal>

                    <Modal
                        isVisible={this.state.visibleModal === 'wrongapilocation'}
                        backdropColor="#B4B3DB"
                        backdropOpacity={0.8}
                        animationIn="zoomInDown"
                        animationOut="zoomOutUp"
                        animationInTiming={600}
                        animationOutTiming={600}
                        backdropTransitionInTiming={600}
                        backdropTransitionOutTiming={600}
                        onBackdropPress={() => this.setState({ visibleModal: null })}
                    >
                        {this.renderModalWrongApiLocation()}
                    </Modal>
                    <Modal
                        isVisible={this.state.visibleModal === 'conerror'}
                        backdropColor="#B4B3DB"
                        backdropOpacity={0.8}
                        animationIn="zoomInDown"
                        animationOut="zoomOutUp"
                        animationInTiming={600}
                        animationOutTiming={600}
                        backdropTransitionInTiming={600}
                        backdropTransitionOutTiming={600}
                        onBackdropPress={() => this.setState({ visibleModal: null })}
                    >
                        {this.renderModalConError()}
                    </Modal>
                </View>
            </ScrollView>
        );
    }
    renderModalSuccessContent = () => (
        <TouchableWithoutFeedback onPress={() => this.setState({ visibleModal: null })}>
            <View style={stylesOkModal.container} onClick={() => this.setState({ visibleModal: null })}>
                <View style={stylesOkModal.contentwrapper} flexDirection="row">
                    <Text style={stylesOkModal.content}>Bienvenido! </Text>
                    <Text style={stylesOkModal.fullname}>{this.state.fullname}</Text>
                </View>
                <View flexDirection="row" style={stylesOkModal.messagewrapper}>
                    <Text style={stylesOkModal.content}>{this.state.typeLabel}</Text>
                    <Text style={stylesOkModal.content}>{this.state.time}</Text>
                    <Text style={stylesOkModal.content}>. Success!</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
    renderModalWarningContent = () => (
        <TouchableWithoutFeedback onPress={() => this.setState({ visibleModal: null })}>
            <View style={stylesWarnModal.container}>
                <View style={stylesWarnModal.contentwrapper} flexDirection="row">
                    <Text style={stylesWarnModal.content}>Bienvenido! </Text>
                    <Text style={stylesWarnModal.fullname}></Text>
                </View>
                <View style={stylesWarnModal.messagewrapper}>
                    <Text style={stylesWarnModal.content}>{this.state.message}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );

    renderModalServerUrlContent = () => (
        <View style={stylesLocationModal.container}>
            <View style={stylesLocationModal.inputwrapper}>
                <TextInput placeholder="API Ubicación" style={stylesLocationModal.inputlocation}
                    onChangeText={(server_url) => this.setState({ server_url })} value={this.state.server_url} />
            </View>
            <View style={stylesLocationModal.btnregisterwrapper}>
                {/* <Button onPress={this._registerServerUrl.bind(this)} title="Registro" /> */}
                <TouchableHighlight onPress={this._registerServerUrl.bind(this)} underlayColor="white">
                    <View style={stylesLocationModal.btnregisterapi}>
                        <Text style={stylesLocationModal.btnregisterapilabel}>Registro</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </View>
    );
    renderModalEditServerUrlContent = () => (
        <View style={stylesLocationModal.container}>
            <View style={stylesLocationModal.inputwrapper}>
                <TextInput placeholder="API Ubicación" style={stylesLocationModal.inputlocation}
                    onChangeText={(server_url) => this.setState({ server_url })} value={this.state.server_url} />
            </View>
            <View style={stylesLocationModal.btnregisterwrapper}>
                <TouchableHighlight onPress={this._registerServerUrl.bind(this)} underlayColor="white">
                    <View style={stylesLocationModal.btnregisterapi}>
                        <Text style={stylesLocationModal.btnregisterapilabel}>Registro</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </View>
    );

    renderModalWrongApiLocation = () => (
        <TouchableWithoutFeedback onPress={() => this.setState({ visibleModal: null })}>
            <View style={stylesWarnModal.container}>
                <View style={stylesWarnModal.wrongapimessagewrapper}>
                    <Text style={stylesWarnModal.content}>Ubicación incorrecta de la API</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );

    renderModalConError = () => (
        <TouchableWithoutFeedback onPress={() => this.setState({ visibleModal: null })}>
            <View style={stylesWarnModal.container}>
                <View style={stylesWarnModal.wrongapimessagewrapper}>
                    <Text style={stylesWarnModal.content}>Error de conexión</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}