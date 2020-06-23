import React, { useState, useEffect } from 'react';
import api from './api';
import Header from './header';
import { 
    Container, 
    Table, 
    TableRow, 
    TableCell,
    Dialog, 
    Button, 
    DialogTitle, 
    DialogContent, 
    DialogContentText, 
    TextField, 
    DialogActions} from '@material-ui/core';

function App() {

    const [ lista, setLista ] = useState([]); 
    const [ open, setOpen ] = useState(false);
    const [ compromisso, setCompromisso ] = useState('');
    const [ data,SetData] = useState('');

    function loadData() { 
        api.get('/agenda').then((response) => { 
            const itens = response.data;
            setLista(itens);
        });
    }

    useEffect(() => loadData(), [])

    const openModal = () => setOpen(true);

    const closeModal = () => setOpen(false);

     function addCompromisso() { 
         const name = compromisso;
         const date = data;
         api.post('/chamado', { compromisso: name, data: date, realizado: false }).then((response) => {
            setCompromisso('');
            SetData('');
            setOpen(false);
            loadData();
        })
     }
     function markAsDone(id) { 
         api.patch(`/agenda/${id}/done`).then((response) => {
             loadData()
         })
     }

     function deleteCompromisso(id) {
         api.delete(`/agenda/${id}`).then((response) => { 
            loadData()
         })
     }
    

    return (
        <>
        <Header />
        <Container maxWidth="lg" className="container"> 
            <Table>
                {lista.map(item => (
                    <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.compromisso}</TableCell>
                        <TableCell>{item.data}</TableCell>
                        <TableCell>
                            <input type="checkbox" checked={item.realizado} onChange={() => markAsDone(item.id)}/>
                        </TableCell>
                        <TableCell>
                            <Button variant="outlined" size="small" color="secondary" onClick={() => deleteCompromisso(item.id)}>Apagar</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>
            <Button 
                onClick={openModal}
                variant="contained" 
                color="primary" 
                style={{marginTop: '20px'}}>
                Adicionar
            </Button>
        </Container>
        <Dialog open={open} onClose={closeModal} fullWidth={true} maxWidth="sm">
            <DialogTitle id="form-dialog-title">Novo Chamado</DialogTitle>
            <DialogContent>
                <DialogContentText>
                   Adicione um novo compromisso
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Compromisso"
                    type="email"
                    fullWidth
                    value={compromisso}
                    onChange={e => setCompromisso(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="date"
                    label="Data"
                    type="email"
                    fullWidth
                    value={data}
                    onChange={e => SetData(e.target.value)}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={closeModal} color="primary">
                    Cancelar
                </Button>
                <Button onClick={addChamado} color="primary">
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
}

export default App;
