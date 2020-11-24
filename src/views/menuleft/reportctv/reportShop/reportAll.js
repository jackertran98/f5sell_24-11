import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Picker, ScrollView, RefreshControl } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { sizeHeight, sizeWidth } from '../../../../utils/helper/size.helper';
import { connect } from 'react-redux';
var numeral = require("numeral");
import Loading from '../../../../components/loading';
import { ReportDefault } from "../../../../service/account";
import ReportYear from "./reportyear";
import ReportMonth from './ReportMonth';
import ReportDay from './ReportDay';
import DropDownPicker from 'react-native-dropdown-picker';

class ReportAll extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Data: [],
            selectedValue: '',
        }
    }
    config=(item)=>{
        console.log("item",item);
        if(item==1){
            return (<ReportYear item={item}/>);
        }else if(item==2){
            return <ReportMonth item={item}/>
        }else{
            return <ReportDay item={item}/>
        }
    }
    render() {
        const { selectedValue } = this.state;
        console.log("thssss", selectedValue);
        return (
            <View >
                <View style={{ alignItems: 'center', margin: 10 }}>
                    <Text style={{fontSize:16,marginBottom:10}}>Chọn kiểu thống kê</Text>
                    <View
                            style={{

                                // The solution: Apply zIndex to any device except Android
                                ...(Platform.OS !== 'android' && {
                                  zIndex: 10
                                })
                                
                              }}
                        >
                        <DropDownPicker
                            items={[
                                { label: 'Báo cáo năm', value: '1'},
                                { label: 'Báo cáo tháng', value: '2'},
                                { label: 'Báo cáo ngày', value: '3'},
                                
                            ]}
                            defaultValue={selectedValue}
                            placeholder="Trạng thái"
                            containerStyle={{ height: 40 }}
                            style={{ backgroundColor: '#fafafa',width:sizeWidth(50),borderColor:'#E1AC06',borderWidth:2}}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{ backgroundColor: '#fafafa',width:sizeWidth(50)}}
                            onChangeItem={item => this.setState({
                                selectedValue: item.value
                            })}
                        />
                        </View>
                </View>
                <View style={{ height: 5, backgroundColor: '#CCCECE',margin:10,zIndex:-1 }}></View>
                <View style={{zIndex:-1}}>
                    {this.config(selectedValue)}
                </View>
            </View>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authUser.status,
        authUser: state.authUser.authUser,
        username: state.authUser.username,
    };
};
const styles = StyleSheet.create({
    container: {

        borderColor: '#E1AC06',
        borderWidth: 2,
        borderRadius:15,
        alignItems: "center"
    },
   
})

export default connect(
    mapStateToProps,
    null
)(ReportAll);
