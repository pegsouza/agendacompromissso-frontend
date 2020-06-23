import React, { useState, useEffect } from 'react';
import api from './api';
import Header from './header';
import { 
    Container, 
    Table, 
    TableRow, 
    TableCell,
    TableHead, 
    Dialog, 
    Button, 
    DialogTitle, 
    DialogContent, 
    DialogContentText, 
    TextField, 
    DialogActions} from '@material-ui/core';
import './style.css';

function App() {

    const [ lista, setLista ] = useState([]); 
    const [ open, setOpen ] = useState(false);
    const [ chamado, setChamado ] = useState('');
    const [ descricao,SetDescricao] = useState('');

    function loadData() { 
        api.get('/chamado').then((response) => { 
            const itens = response.data;
            setLista(itens);
        });
    }

    useEffect(() => loadData(), [])

    const openModal = () => setOpen(true);

    const closeModal = () => setOpen(false);

     function addChamado() { 
         const name = chamado;
         const desc = descricao;
         api.post('/chamado', { chamado: name, descricao: desc, concluido: false }).then((response) => {
            setChamado('');
            SetDescricao('');
            setOpen(false);
            loadData();
        })
     }
     function markAsDone(id) { 
         api.patch(`/chamado/${id}/done`).then((response) => {
             loadData()
         })
     }

     function deleteChamado(id) {
         api.delete(`/chamado/${id}`).then((response) => { 
            loadData()
         })
     }
    

    return (
        <>
        <Header />
        <Container maxWidth="lg" className="container"> 
            <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="left">Titulo</TableCell>
            <TableCell align="left">Descricacao</TableCell>
            <TableCell align="left">Concluido</TableCell>
            <TableCell align="left"> </TableCell>
          </TableRow>
        </TableHead>
                {lista.map(item => (
                    <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.chamado}</TableCell>
                        <TableCell>{item.descricao}</TableCell>
                        <TableCell>
                            <input type="checkbox" checked={item.concluido} onChange={() => markAsDone(item.id)}/>
                        </TableCell>
                        <TableCell>
                            <Button variant="outlined" size="small" color="secondary" onClick={() => deleteChamado(item.id)}>Apagar</Button>
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
                    Digite qual problema esta ocorrendo.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Chamado"
                    type="email"
                    fullWidth
                    value={chamado}
                    onChange={e => setChamado(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="desc"
                    label="Descricao"
                    type="email"
                    fullWidth
                    value={descricao}
                    onChange={e => SetDescricao(e.target.value)}
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
