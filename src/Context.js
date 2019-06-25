import React, { Component } from 'react'
import items from './data';
import Client from './Contentful';



const RoomContext = React.createContext();


class RoomProvider extends Component {
    state = {
        rooms: [],
        sortedRooms: [],
        featuredRooms: [],
        loading: true,
        type: "all",
        capacity: 1,
        price: 0,
        minPrice: 0,
        maxPrice: 0,
        minSize: 0,
        maxSize: 0,
        breakfast: false,
        pets: false
    };

    getData = async () => {
        try {
            let response = await Client.getEntries({
                content_type: 'beachResortRoom',
                order: 'sys.createdAt',
                //order: 'fields.price'
                //order: '-fields.price'

            });
            let rooms = this.formatData(response.items);
            let featuredRooms = rooms.filter(room => room.featured === true);
            let maxPrice = Math.max(...rooms.map(item => item.price));
            let maxSize = Math.max(...rooms.map(item => item.size));
    
            this.setState({
                rooms: rooms,
                featuredRooms: featuredRooms,
                sortedRooms: rooms,
                loading: false,
                price: maxPrice,
                maxPrice: maxPrice,
                maxSize: maxSize
    
            });
        } catch (error) {
            console.log(error);
        }
    }

    componentDidMount() {
      this.getData();
    }

    formatData(items) {
        let tempItems = items.map(item => {
            let id = item.sys.id;
            let images = item.fields.images.map(image => image.fields.file.url);

            let room = { ...item.fields, images: images, id };
            return room;
        });

        return tempItems;
    }

    getRoom = (slug) => {
        let tempRooms = [...this.state.rooms];
        const room = tempRooms.find(room => room.slug === slug);
        return room;
    }

    handleChange = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const type = event.target.type;
        const name = event.target.name;

        this.setState({
            [name]: value,
        }, this.filterRooms);

        console.log(type, name, value);
    }

    filterRooms = () => {
        let { rooms, type, capacity, price, minSize, maxSize, minPrice, maxPrice, breakfast, pets } = this.state;

        let tempRooms = [...rooms];
        capacity = parseInt(capacity);
        price = parseInt(price);

        if (type !== 'all') {
            tempRooms = tempRooms.filter(room => room.type === type);
        }
        if (capacity !== 1) {
            tempRooms = tempRooms.filter(room => room.capacity >= capacity);
        }
        tempRooms = tempRooms.filter(room => room.price <= price);
        tempRooms = tempRooms.filter(room => room.size >= minSize && room.size <= maxSize);
        if (breakfast === true) {
            tempRooms = tempRooms.filter(room => room.breakfast === true);
        }
        if (pets === true) {
            tempRooms = tempRooms.filter(room => room.pets === true);
        }

        this.setState({
            sortedRooms: tempRooms
        });
    };

    render() {
        return (
            <RoomContext.Provider value={{ ...this.state, getRoom: this.getRoom, handleChange: this.handleChange }}>
                {this.props.children}
            </RoomContext.Provider>
        )
    }
}

const RoomConsumer = RoomContext.Consumer;


export function withRoomConsumer(Component) {
    return function ConsumerWrapper(props) {
        return <RoomConsumer>
            {
                (value) => <Component {...props} context={value} />
            }
        </RoomConsumer>
    }
}


export { RoomProvider, RoomConsumer, RoomContext };