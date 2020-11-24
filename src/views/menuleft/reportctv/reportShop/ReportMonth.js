import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Picker, ScrollView, RefreshControl } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { sizeHeight, sizeWidth } from '../../../../utils/helper/size.helper';
import { connect } from 'react-redux';
var numeral = require("numeral");
import { ReportDefault } from "../../../../service/account";
import { TextInput } from 'react-native-paper';
class ReportMonth extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            selectedValue: '2019',
            loading: false,
        }
    }
    handLoad = () => {
        ReportDefault({
            USERNAME: this.props.username,
            YEAR: this.state.selectedValue,
            MONTH: '',
            REPORT_TYPE: this.props.item,
            IDSHOP: this.props.idshop.USER_CODE
        })
            .then((result) => {
                this.setState({
                    data: result.data.INFO,
                    loading: true,
                })
            })
    }
    componentDidMount() {
        this.handLoad();
    }
    render() {
        const { data, selectedValue } = this.state;
        return (
            <View >
                <View style={{flexDirection:'row',alignItems:'center',padding:10}}>
                    <Text>Chọn năm</Text>
                    <View style={styles.container}>
                        <Picker
                            selectedValue={selectedValue}
                            style={{ height: 35, width: sizeWidth(27)}}
                            onValueChange={(itemValue, itemIndex) => this.setState({ selectedValue: itemValue },()=>{
                                this.handLoad()
                            })}
                        >
                            <Picker.Item label="2019" value="2019" />
                            <Picker.Item label="2020" value="2020" />
                        </Picker>
                    </View>
                </View>
                <ScrollView horizontal={true}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={[styles.mainUser, styles.custom, styles.customTop]}>
                            <Text style={styles.row1}>Tháng</Text>
                            <Text style={styles.row2}>Số lượng ĐH</Text>
                            <Text style={styles.row4}>Tổng doanh số</Text>
                            <Text style={styles.row5}>Hoa hồng</Text>
                            <Text style={styles.row6}>Thực thu</Text>
                        </View>
                        <View>
                            {data.length != 0 ? data.map((val, key) => {
                                return (
                                    <View style={[styles.mainUser, styles.custom]}>
                                        <Text style={styles.row1}>{val.MONTH}</Text>
                                        <Text style={styles.row2}>{val.TOTAL_ORDER}</Text>
                                        <Text style={styles.row4}>{numeral(val.TOTAL_TT).format("0,0")}</Text>
                                        <Text style={styles.row5} >{numeral(val.TOTAL_COMMISSION).format("0,0")}</Text>
                                        <Text style={styles.row6}>{numeral(val.TOTAL_MONEY).format("0,0")}</Text>
                                    </View>
                                )
                            }) : null}
                        </View>
                    </View>
                </ScrollView>
            </View>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authUser.status,
        authUser: state.authUser.authUser,
        username: state.authUser.username,
        idshop: state.product.database,
    };
};
const styles = StyleSheet.create({
    container:{
        borderColor:'#E1AC06',
        borderWidth:2,
        borderRadius:10,
        marginLeft:10,
    },  
    mainUser: {
        flexDirection: 'row',
    },
    row1: {
        paddingTop: sizeHeight(1),
        height: sizeHeight(5),
        textAlign: 'center',
        width: sizeWidth(12),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row2: {
        paddingTop: sizeHeight(1),
        textAlign: 'center',
        width: sizeWidth(30),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row3: {
        paddingTop: sizeHeight(1),
        textAlign: 'center',
        width: sizeWidth(30),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row4: {
        paddingTop: sizeHeight(1),
        textAlign: 'center',
        width: sizeWidth(30),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row5: {
        paddingTop: sizeHeight(1),
        textAlign: 'center',
        width: sizeWidth(30),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row6: {
        paddingTop: sizeHeight(1),
        textAlign: 'center',
        width: sizeWidth(30),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    row7: {
        paddingTop: sizeHeight(1),
        textAlign: 'center',
        width: sizeWidth(20),
        borderRightColor: '#E1AC06',
        borderRightWidth: 1,
    },
    custom: {
        borderBottomColor: '#E1AC06',
        borderBottomWidth: 1,

    },
    customTop: {
        borderTopColor: '#E1AC06',
        borderTopWidth: 1,
    }
})

export default connect(
    mapStateToProps,
    null
)(ReportMonth);
